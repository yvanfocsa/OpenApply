import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fetchOfferDetails } from "./job-sourcer.mjs";

const DEFAULT_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_SNAPSHOT_CHARACTERS = 14_000;
const inFlight = new Map();

export function singleHttpUrl(value) {
  const input = String(value || "").trim();
  if (!/^https?:\/\/\S+$/i.test(input)) return "";
  try {
    const parsed = new URL(input);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.toString() : "";
  } catch {
    return "";
  }
}

function cachePath(cacheDirectory, url) {
  const key = createHash("sha256").update(url).digest("hex");
  return path.join(cacheDirectory, `${key}.json`);
}

function usableSnapshot(value) {
  const text = String(value || "").replace(/\u0000/g, "").trim().slice(0, MAX_SNAPSHOT_CHARACTERS);
  if (text.length < 240) return "";
  if (/access denied|captcha|enable javascript|javascript is required/i.test(text) && text.length < 1_200) {
    return "";
  }
  return text;
}

async function readCachedSnapshot(cacheDirectory, url, ttlMs) {
  try {
    const parsed = JSON.parse(await readFile(cachePath(cacheDirectory, url), "utf8"));
    const cachedAt = Date.parse(parsed.cachedAt);
    if (parsed.url !== url || !Number.isFinite(cachedAt) || Date.now() - cachedAt >= ttlMs) return "";
    return usableSnapshot(parsed.text);
  } catch {
    return "";
  }
}

async function fetchAndCache(cacheDirectory, url, fetcher) {
  const existing = inFlight.get(url);
  if (existing) return existing;
  const request = (async () => {
    const result = await fetcher(url);
    const text = usableSnapshot(result?.rawText);
    if (!text) return "";
    await mkdir(cacheDirectory, { recursive: true });
    await writeFile(
      cachePath(cacheDirectory, url),
      `${JSON.stringify({
        version: 1,
        url,
        cachedAt: new Date().toISOString(),
        text,
      })}\n`,
      "utf8"
    );
    return text;
  })().finally(() => inFlight.delete(url));
  inFlight.set(url, request);
  return request;
}

async function pageSnapshot(
  url,
  {
    cacheDirectory,
    ttlMs = DEFAULT_TTL_MS,
    fetcher = fetchOfferDetails,
  }
) {
  const cached = await readCachedSnapshot(cacheDirectory, url, ttlMs);
  if (cached) return { text: cached, source: "cache" };
  try {
    const text = await fetchAndCache(cacheDirectory, url, fetcher);
    return { text, source: text ? "network" : "unavailable" };
  } catch {
    return { text: "", source: "unavailable" };
  }
}

export async function hydrateOfferSource(offer, options) {
  const url = singleHttpUrl(offer);
  if (!url) {
    return {
      offer: String(offer || ""),
      url: "",
      snapshotSource: "not-needed",
      usedSnapshot: false,
    };
  }
  const snapshot = await pageSnapshot(url, options);
  if (!snapshot.text) {
    return {
      offer: url,
      url,
      snapshotSource: snapshot.source,
      usedSnapshot: false,
    };
  }
  return {
    offer: `<source-url>${url}</source-url>\n<cached-page-snapshot>\n${snapshot.text}\n</cached-page-snapshot>`,
    url,
    snapshotSource: snapshot.source,
    usedSnapshot: true,
  };
}

export async function hydrateSpontaneousSource(offer, target, options) {
  const url = singleHttpUrl(target?.website);
  if (!url) return hydrateOfferSource(offer, options);
  const snapshot = await pageSnapshot(url, options);
  if (!snapshot.text) {
    return {
      offer: String(offer || ""),
      url,
      snapshotSource: snapshot.source,
      usedSnapshot: false,
    };
  }
  return {
    offer: `${String(offer || "")}\n<reference-url>${url}</reference-url>\n<cached-page-snapshot>\n${snapshot.text}\n</cached-page-snapshot>`,
    url,
    snapshotSource: snapshot.source,
    usedSnapshot: true,
  };
}
