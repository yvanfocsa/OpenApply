export const OLLAMA_MINIMUM_CONTEXT = 64_000;

export function ollamaCodexAgentArgs() {
  return [
    "--ignore-user-config",
    "--disable",
    "plugins",
    "-c",
    'model_reasoning_effort="high"',
    "-c",
    "model_context_window=65536",
  ];
}

export function ollamaNativeEndpoint(endpoint) {
  try {
    const url = new URL(endpoint);
    url.pathname = url.pathname.replace(/\/v1\/?$/i, "") || "/";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return "";
  }
}

export function ollamaRecommendedInstallModel(memoryBytes) {
  const memoryGiB = Number(memoryBytes || 0) / 1024 / 1024 / 1024;
  return memoryGiB >= 72 ? "gpt-oss:120b" : "gpt-oss:20b";
}

export function ollamaModelQuality(model) {
  const capabilities = Array.isArray(model?.capabilities) ? model.capabilities : [];
  const toolReady = capabilities.includes("tools");
  const contextReady = Number(model?.contextLength || 0) >= OLLAMA_MINIMUM_CONTEXT;
  const agentReady = /(?:^|[/:-])(?:gpt-oss|qwen3-coder)(?=$|[/:-])/i
    .test(`${model?.id || ""}:${model?.family || ""}`);
  const parameterCount = Number(model?.parameterCount || 0);
  const compatible = toolReady && contextReady && agentReady;
  const level = !compatible
    ? "incompatible"
    : parameterCount >= 60_000_000_000
      ? "maximum"
      : parameterCount >= 18_000_000_000
        ? "quality"
        : "balanced";
  return {
    compatible,
    level,
    toolReady,
    contextReady,
    agentReady,
  };
}

export function ollamaModelDetail(model, payload = {}) {
  const modelInfo = payload?.model_info && typeof payload.model_info === "object"
    ? payload.model_info
    : {};
  const contextEntry = Object.entries(modelInfo)
    .find(([key, value]) => key.endsWith(".context_length") && Number.isFinite(Number(value)));
  const detail = {
    id: String(model || ""),
    parameterSize: String(payload?.details?.parameter_size || ""),
    quantization: String(payload?.details?.quantization_level || ""),
    family: String(payload?.details?.family || ""),
    parameterCount: Number(modelInfo["general.parameter_count"] || 0),
    contextLength: Number(contextEntry?.[1] || 0),
    capabilities: Array.isArray(payload?.capabilities) ? payload.capabilities.map(String) : [],
  };
  return { ...detail, ...ollamaModelQuality(detail) };
}

export function preferredInstalledOllamaModel(modelDetails, fallback = "") {
  const score = (model) => {
    const quality = {
      maximum: 400,
      quality: 300,
      balanced: 200,
      incompatible: 0,
    }[model.level] || 0;
    const familyBonus = /gpt-oss|qwen3(?:\.\d+)?(?:-coder)?/i.test(model.id) ? 30 : 0;
    return quality + familyBonus + Math.min(80, Number(model.parameterCount || 0) / 1_000_000_000);
  };
  return [...modelDetails]
    .filter((model) => model.compatible)
    .sort((first, second) => score(second) - score(first))[0]?.id || fallback;
}
