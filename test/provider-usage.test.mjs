import assert from "node:assert/strict";
import {
  extractTokenUsage,
  mergeTokenUsage,
  parseCodexRateLimits,
} from "../app/provider-usage.mjs";

const parsed = parseCodexRateLimits({
  rateLimitsByLimitId: {
    codex: {
      limitName: "Codex",
      planType: "pro",
      primary: {
        usedPercent: 23,
        resetsAt: 2_000_000_000,
        windowDurationMins: 300,
      },
      secondary: {
        usedPercent: 40,
        resetsAt: 2_000_100_000,
        windowDurationMins: 10_080,
      },
    },
  },
});

assert.equal(parsed.available, true);
assert.equal(parsed.exact, true);
assert.equal(parsed.remainingPercent, 60);
assert.equal(parsed.buckets[0].windows[0].remainingPercent, 77);
assert.equal(parsed.buckets[0].windows[1].remainingPercent, 60);

const missingPercent = parseCodexRateLimits({
  rateLimits: { limitName: "Codex", primary: {} },
});
assert.equal(missingPercent.available, true);
assert.equal(missingPercent.exact, false);
assert.equal(missingPercent.remainingPercent, null);

assert.deepEqual(
  extractTokenUsage({
    usage: {
      input_tokens: 120,
      output_tokens: 30,
      cache_read_input_tokens: 50,
      details: {
        input_tokens: 120,
        output_tokens: 30,
      },
    },
  }),
  {
    inputTokens: 120,
    outputTokens: 30,
    cachedInputTokens: 50,
    totalTokens: 150,
  }
);

assert.deepEqual(
  mergeTokenUsage(
    { inputTokens: 100, outputTokens: 20, cachedInputTokens: 40, totalTokens: 120 },
    { inputTokens: 10, outputTokens: 5, cachedInputTokens: 0, totalTokens: 15 }
  ),
  { inputTokens: 110, outputTokens: 25, cachedInputTokens: 40, totalTokens: 135 }
);

console.log("provider-usage: ok");
