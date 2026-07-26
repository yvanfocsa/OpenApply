export const ANTIGRAVITY_PROBE_TTL_MS = 5 * 60 * 1000;

export function parseAntigravityModels(stdout) {
  return [...new Set(
    String(stdout || "")
      .replace(/\u001b\[[0-9;?]*[ -/]*[@-~]/g, "")
      .split(/[\r\n]+/)
      .map((value) => {
        const line = value.trim();
        if (/^[a-z0-9][a-z0-9._:/-]{1,159}$/i.test(line)) return line;
        return line.match(/^([a-z0-9][a-z0-9._:/-]{1,159})\s{2,}\S/i)?.[1] || "";
      })
      .filter(Boolean)
  )].slice(0, 40);
}

export function antigravityPromptDocument(prompt, schema) {
  return `${String(prompt || "").trim()}

Antigravity output contract:
- Complete the task before answering.
- Your final answer must contain only one JSON object.
- Do not wrap the JSON in Markdown or add commentary.
- The JSON must validate against this exact schema:

${JSON.stringify(schema)}
`;
}

export function efficientAntigravityModel({
  requestedModel,
  jobKind,
  retryCount = 0,
  availableModels = [],
}) {
  const requested = String(requestedModel || "").trim();
  if (!requested) return "";
  const firstAttempt = Number(retryCount || 0) === 0;
  const efficientGeneration = jobKind === "generation"
    && firstAttempt
    && /flash-high$/i.test(requested);
  if (jobKind !== "analysis" && !efficientGeneration) return requested;
  const candidates = jobKind === "generation"
    ? [requested.replace(/high$/i, "medium")]
    : [
        requested.replace(/high$/i, "medium"),
        requested.replace(/high$/i, "low"),
      ];
  return candidates.find((candidate) => (
    candidate !== requested && availableModels.includes(candidate)
  )) || requested;
}
export function antigravityInvocationArgs({
  jobKind,
  model,
  promptPath,
}) {
  const analysis = jobKind === "analysis";
  const args = [
    "-p",
    `Read the complete task from this local file and follow it exactly: ${promptPath}`,
    "--mode",
    analysis ? "plan" : "accept-edits",
    "--sandbox",
    "--dangerously-skip-permissions",
    "--print-timeout",
    analysis ? "8m" : "20m",
  ];
  if (model) args.push("--model", model);
  else args.push("--effort", analysis ? "medium" : "high");
  return args;
}
