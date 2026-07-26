import assert from "node:assert/strict";
import {
  OLLAMA_MINIMUM_CONTEXT,
  ollamaCodexAgentArgs,
  ollamaModelDetail,
  ollamaNativeEndpoint,
  ollamaRecommendedInstallModel,
  preferredInstalledOllamaModel,
} from "../app/ollama-provider.mjs";

assert.deepEqual(ollamaCodexAgentArgs(), [
  "--ignore-user-config",
  "--disable",
  "plugins",
  "-c",
  'model_reasoning_effort="high"',
  "-c",
  "model_context_window=65536",
]);
assert.equal(ollamaNativeEndpoint("http://127.0.0.1:11434/v1"), "http://127.0.0.1:11434");
assert.equal(ollamaRecommendedInstallModel(16 * 1024 ** 3), "gpt-oss:20b");
assert.equal(ollamaRecommendedInstallModel(96 * 1024 ** 3), "gpt-oss:120b");

const compact = ollamaModelDetail("qwen3-coder:9b", {
  capabilities: ["tools", "thinking", "completion"],
  details: {
    family: "qwen3-coder",
    parameter_size: "9.2B",
    quantization_level: "Q5_K_M",
  },
  model_info: {
    "general.parameter_count": 9_200_000_000,
    "qwen.context_length": OLLAMA_MINIMUM_CONTEXT,
  },
});
assert.equal(compact.compatible, true);
assert.equal(compact.level, "balanced");
assert.equal(compact.agentReady, true);

const quality = ollamaModelDetail("gpt-oss:20b", {
  capabilities: ["tools", "thinking", "completion"],
  details: { family: "gpt-oss", parameter_size: "20B" },
  model_info: {
    "general.parameter_count": 20_000_000_000,
    "gptoss.context_length": 128_000,
  },
});
assert.equal(quality.level, "quality");

const missingTools = ollamaModelDetail("text-only", {
  capabilities: ["completion"],
  model_info: { "model.context_length": 128_000 },
});
assert.equal(missingTools.compatible, false);

const genericToolModel = ollamaModelDetail("custom-qwen:latest", {
  capabilities: ["tools", "thinking", "completion"],
  details: { family: "qwen35" },
  model_info: {
    "general.parameter_count": 9_000_000_000,
    "qwen.context_length": 128_000,
  },
});
assert.equal(genericToolModel.agentReady, false);
assert.equal(genericToolModel.compatible, false);
assert.equal(preferredInstalledOllamaModel([missingTools, compact, quality]), "gpt-oss:20b");

console.log("ollama-provider: ok");
