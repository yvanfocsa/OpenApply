import assert from "node:assert/strict";
import {
  deduplicateJobs,
  franceTravailKeywords,
  parseAtsSources,
  searchJobs,
  validateAtsSources,
  verifySourcingCredential,
} from "../app/job-sourcer.mjs";

assert.equal(
  franceTravailKeywords("cybersécurité, cybersecurity, sécurité, security, GRC, SOC, CSIRT, IAM"),
  "cybersécurité,cybersecurity,sécurité,GRC,SOC,CSIRT,IAM"
);
assert.deepEqual(parseAtsSources([
  "https://job-boards.greenhouse.io/datadog",
  "https://jobs.eu.lever.co/exemple",
  "greenhouse:datadog",
]), [
  {
    type: "greenhouse",
    token: "datadog",
    company: "datadog",
    region: "global",
  },
  {
    type: "lever",
    token: "exemple",
    company: "exemple",
    region: "eu",
  },
]);

assert.deepEqual(
  validateAtsSources("https://job-boards.greenhouse.io/datadog\nhttps://example.com/jobs").invalid,
  ["https://example.com/jobs"]
);

const deduplicated = deduplicateJobs([
  {
    sourceId: "francetravail",
    sourceName: "France Travail",
    externalId: "123",
    title: "Analyste SOC",
    company: "Exemple",
    location: "Paris, France",
    url: "https://candidat.francetravail.fr/offres/recherche/detail/123",
    contract: "cdi",
  },
  {
    sourceId: "greenhouse:exemple",
    sourceName: "Greenhouse, Exemple",
    externalId: "456",
    title: "Analyste SOC",
    company: "Exemple",
    location: "Paris, France",
    url: "https://job-boards.greenhouse.io/exemple/jobs/456?gh_jid=456",
    contract: "cdi",
  },
]);
assert.equal(deduplicated.length, 1);
assert.equal(deduplicated[0].sourceId, "greenhouse:exemple");
assert.deepEqual(deduplicated[0].sources.sort(), ["France Travail", "Greenhouse, Exemple"]);
assert.equal(deduplicated[0].classification.family.id, "soc-csirt");

const empty = await searchJobs({
  query: "cybersécurité",
  atsSources: [],
  contract: "cdi",
});
assert.equal(empty.live, false);
assert.equal(empty.total, 0);
assert.ok(empty.sources.some((source) => source.id === "linkedin" && source.state === "restricted"));
assert.ok(empty.sources.some((source) => source.id === "wttj" && source.state === "manual"));

const originalFetch = globalThis.fetch;
let capturedCredentialRequest = null;
globalThis.fetch = async (url, options = {}) => {
  capturedCredentialRequest = { url: String(url), options };
  return new Response(JSON.stringify({ access_token: "verified-token" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
const franceVerification = await verifySourcingCredential("francetravail", {
  clientId: "client-id",
  clientSecret: "client-secret",
});
assert.match(franceVerification.message, /France Travail vérifiée/);
assert.match(capturedCredentialRequest.options.body, /api_offresdemploiv2/);

globalThis.fetch = async (url, options = {}) => {
  capturedCredentialRequest = { url: String(url), options };
  return new Response(JSON.stringify({
    jobs: [{
      identifier: { id: "lba-1", partner_label: "La Bonne Alternance" },
      workplace: { name: "Exemple", location: { address: "Paris" } },
      offer: { title: "Analyste cybersécurité", description: "Sécurité des systèmes" },
      publication: {},
      apply: { url: "https://example.com/jobs/lba-1" },
    }],
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
const alternanceVerification = await verifySourcingCredential("labonnealternance", { token: "api-token" });
assert.match(alternanceVerification.message, /Bonne Alternance vérifiée/);
assert.match(capturedCredentialRequest.url, /\/api\/job\/v1\/search\?/);
assert.equal(capturedCredentialRequest.options.headers.Authorization, "Bearer api-token");
const franceWideAlternance = await searchJobs({
  query: "cybersécurité",
  location: "France",
  contract: "alternance",
  seniority: "all",
  atsSources: [],
  laBonneAlternance: { token: "api-token" },
});
assert.equal(franceWideAlternance.jobs.length, 1);
globalThis.fetch = originalFetch;
await assert.rejects(
  () => verifySourcingCredential("francetravail", { clientId: "client-seul" }),
  /identifiant client et le secret/i
);
await assert.rejects(
  () => verifySourcingCredential("labonnealternance", {}),
  /jeton La Bonne Alternance/i
);
await assert.rejects(
  () => verifySourcingCredential("inconnue", {}),
  /Source officielle inconnue/i
);
console.log("job-sourcer: ok");
