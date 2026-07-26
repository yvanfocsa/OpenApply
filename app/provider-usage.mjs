import {
  portableEnvironment,
  spawnPortable,
  terminatePortableProcess,
} from "./platform.mjs";

const USAGE_CACHE_TTL_MS = 45_000;
const usageCache = new Map();

function clampPercent(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function codexWindow(window, label) {
  if (!window || typeof window.usedPercent !== "number") return null;
  return {
    id: label,
    label,
    remainingPercent: clampPercent(100 - window.usedPercent),
    usedPercent: clampPercent(window.usedPercent),
    resetsAt: typeof window.resetsAt === "number" ? new Date(window.resetsAt * 1000).toISOString() : null,
    windowMinutes: typeof window.windowDurationMins === "number" ? window.windowDurationMins : null,
  };
}

export function parseCodexRateLimits(payload) {
  const snapshots = payload?.rateLimitsByLimitId && typeof payload.rateLimitsByLimitId === "object"
    ? Object.entries(payload.rateLimitsByLimitId)
    : [["codex", payload?.rateLimits]];
  const buckets = snapshots
    .filter(([, snapshot]) => snapshot && typeof snapshot === "object")
    .map(([id, snapshot]) => {
      const windows = [
        codexWindow(snapshot.primary, "Fenêtre principale"),
        codexWindow(snapshot.secondary, "Fenêtre hebdomadaire"),
      ].filter(Boolean);
      const exactRemaining = windows.length
        ? Math.min(...windows.map((window) => window.remainingPercent))
        : null;
      return {
        id,
        label: snapshot.limitName || id,
        remainingPercent: exactRemaining,
        planType: snapshot.planType || null,
        reached: Boolean(snapshot.rateLimitReachedType || snapshot.spendControlReached),
        windows,
      };
    });
  const remainingValues = buckets
    .map((bucket) => bucket.remainingPercent)
    .filter((value) => typeof value === "number");
  return {
    available: buckets.length > 0,
    exact: remainingValues.length > 0,
    remainingPercent: remainingValues.length ? Math.min(...remainingValues) : null,
    buckets,
  };
}

function waitForResponse(child, requestId, timeoutMs) {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Délai dépassé pendant la lecture des quotas Codex."));
    }, timeoutMs);
    timer.unref?.();
    const onData = (chunk) => {
      buffer += chunk;
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const message = JSON.parse(line);
          if (message.id !== requestId) continue;
          cleanup();
          if (message.error) reject(new Error(message.error.message || "Réponse Codex invalide."));
          else resolve(message.result);
          return;
        } catch {
          // Ignore protocol notifications and incomplete lines.
        }
      }
    };
    const onExit = () => {
      cleanup();
      reject(new Error("Le service Codex s’est arrêté avant de renvoyer les quotas."));
    };
    const cleanup = () => {
      clearTimeout(timer);
      child.stdout.off("data", onData);
      child.off("exit", onExit);
    };
    child.stdout.on("data", onData);
    child.on("exit", onExit);
  });
}

function sendRpc(child, message) {
  child.stdin.write(`${JSON.stringify(message)}\n`);
}

export async function probeCodexRateLimits(command = "codex", timeoutMs = 7_000) {
  const cacheKey = `codex:${command}`;
  const cached = usageCache.get(cacheKey);
  if (cached && Date.now() - cached.checkedAt < USAGE_CACHE_TTL_MS) return cached.value;
  const child = spawnPortable(command, ["app-server", "--listen", "stdio://"], {
    env: portableEnvironment({ ...process.env, NO_COLOR: "1" }),
    stdio: ["pipe", "pipe", "pipe"],
  });
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  try {
    sendRpc(child, {
      id: 1,
      method: "initialize",
      params: {
        clientInfo: { name: "openapply", title: "OpenApply", version: "1.0.0" },
        capabilities: { experimentalApi: true },
      },
    });
    await waitForResponse(child, 1, timeoutMs);
    sendRpc(child, { id: 2, method: "account/rateLimits/read", params: null });
    const result = parseCodexRateLimits(await waitForResponse(child, 2, timeoutMs));
    const value = {
      provider: "codex",
      source: "provider-live",
      checkedAt: new Date().toISOString(),
      message: result.exact
        ? "Quota Codex lu directement depuis le compte connecté."
        : "Codex est connecté, mais aucun pourcentage de quota n’a été publié.",
      ...result,
    };
    usageCache.set(cacheKey, { checkedAt: Date.now(), value });
    return value;
  } finally {
    child.stdin.end();
    terminatePortableProcess(child);
  }
}

export function unavailableUsage(provider, message, extra = {}) {
  return {
    provider,
    source: "unavailable",
    checkedAt: new Date().toISOString(),
    available: false,
    exact: false,
    remainingPercent: null,
    buckets: [],
    message,
    ...extra,
  };
}

function addUsage(target, input, output, cached = 0) {
  const inputTokens = Number(input);
  const outputTokens = Number(output);
  const cachedTokens = Number(cached);
  if (Number.isFinite(inputTokens) && inputTokens >= 0) target.inputTokens += inputTokens;
  if (Number.isFinite(outputTokens) && outputTokens >= 0) target.outputTokens += outputTokens;
  if (Number.isFinite(cachedTokens) && cachedTokens >= 0) target.cachedInputTokens += cachedTokens;
}

export function extractTokenUsage(value) {
  const total = { inputTokens: 0, outputTokens: 0, cachedInputTokens: 0 };
  const visited = new Set();
  const walk = (node) => {
    if (!node || typeof node !== "object" || visited.has(node)) return;
    visited.add(node);
    if (
      Object.hasOwn(node, "input_tokens")
      || Object.hasOwn(node, "output_tokens")
      || Object.hasOwn(node, "cache_read_input_tokens")
    ) {
      addUsage(total, node.input_tokens, node.output_tokens, node.cache_read_input_tokens);
      return;
    } else if (
      Object.hasOwn(node, "inputTokens")
      || Object.hasOwn(node, "outputTokens")
      || Object.hasOwn(node, "cachedInputTokens")
    ) {
      addUsage(total, node.inputTokens, node.outputTokens, node.cachedInputTokens);
      return;
    }
    for (const nested of Object.values(node)) walk(nested);
  };
  walk(value);
  const measured = total.inputTokens > 0 || total.outputTokens > 0 || total.cachedInputTokens > 0;
  return measured ? { ...total, totalTokens: total.inputTokens + total.outputTokens } : null;
}

export function mergeTokenUsage(first, second) {
  if (!first) return second || null;
  if (!second) return first;
  return {
    inputTokens: (first.inputTokens || 0) + (second.inputTokens || 0),
    outputTokens: (first.outputTokens || 0) + (second.outputTokens || 0),
    cachedInputTokens: (first.cachedInputTokens || 0) + (second.cachedInputTokens || 0),
    totalTokens: (first.totalTokens || 0) + (second.totalTokens || 0),
  };
}
