import assert from "node:assert/strict";
import {
  antigravityInvocationArgs,
  antigravityPromptDocument,
  efficientAntigravityModel,
  parseAntigravityModels,
} from "../app/antigravity-provider.mjs";

const models = parseAntigravityModels(`
gemini-3.6-flash-high
\u001b[Kclaude-sonnet-4-6         Claude Sonnet 4.6 (Thinking)
gemini-3.6-flash-high
not a model
`);
assert.deepEqual(models, ["gemini-3.6-flash-high", "claude-sonnet-4-6"]);

const schema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string" } },
  required: ["status"],
};
const promptDocument = antigravityPromptDocument("Analyse cette offre.", schema);
assert.match(promptDocument, /Analyse cette offre\./);
assert.match(promptDocument, /only one JSON object/);
assert.match(promptDocument, /"additionalProperties":false/);

const analysisArgs = antigravityInvocationArgs({
  jobKind: "analysis",
  model: "gemini-3.6-flash-high",
  promptPath: "/tmp/openapply/prompt.txt",
});
assert.deepEqual(analysisArgs.slice(0, 2), [
  "-p",
  "Read the complete task from this local file and follow it exactly: /tmp/openapply/prompt.txt",
]);
assert.equal(analysisArgs[analysisArgs.indexOf("--mode") + 1], "plan");
assert.equal(analysisArgs[analysisArgs.indexOf("--print-timeout") + 1], "8m");
assert.equal(analysisArgs[analysisArgs.indexOf("--model") + 1], "gemini-3.6-flash-high");
assert.equal(analysisArgs.includes("--effort"), false);

const generationArgs = antigravityInvocationArgs({
  jobKind: "generation",
  model: "",
  promptPath: "/tmp/prompt.txt",
});
assert.equal(generationArgs[generationArgs.indexOf("--mode") + 1], "accept-edits");
assert.equal(generationArgs[generationArgs.indexOf("--effort") + 1], "high");
assert.equal(generationArgs[generationArgs.indexOf("--print-timeout") + 1], "20m");
assert.equal(generationArgs.includes("--model"), false);


const availableFlashModels = [
  "gemini-3.6-flash-high",
  "gemini-3.6-flash-medium",
  "gemini-3.6-flash-low",
];
assert.equal(efficientAntigravityModel({
  requestedModel: "gemini-3.6-flash-high",
  jobKind: "generation",
  availableModels: availableFlashModels,
}), "gemini-3.6-flash-medium");
assert.equal(efficientAntigravityModel({
  requestedModel: "gemini-3.6-flash-high",
  jobKind: "generation",
  retryCount: 1,
  availableModels: availableFlashModels,
}), "gemini-3.6-flash-high");
assert.equal(efficientAntigravityModel({
  requestedModel: "gemini-3.6-flash-high",
  jobKind: "generation",
  availableModels: ["gemini-3.6-flash-high", "gemini-3.6-flash-low"],
}), "gemini-3.6-flash-high");
assert.equal(efficientAntigravityModel({
  requestedModel: "gemini-3.6-flash-high",
  jobKind: "analysis",
  availableModels: availableFlashModels,
}), "gemini-3.6-flash-medium");
assert.equal(efficientAntigravityModel({
  requestedModel: "gemini-3.6-flash-high",
  jobKind: "analysis",
  availableModels: ["gemini-3.6-flash-high", "gemini-3.6-flash-low"],
}), "gemini-3.6-flash-low");

console.log("Antigravity provider tests passed.");
