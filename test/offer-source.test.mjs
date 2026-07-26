import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  hydrateOfferSource,
  hydrateSpontaneousSource,
  singleHttpUrl,
} from "../app/offer-source.mjs";

assert.equal(singleHttpUrl("not a link"), "");
assert.equal(singleHttpUrl("https://jobs.example/role"), "https://jobs.example/role");

const directory = await mkdtemp(path.join(tmpdir(), "openapply-offer-cache-"));
let calls = 0;
const fetcher = async () => {
  calls += 1;
  return {
    rawText: "Analyste SOC. ".repeat(30) + "SIEM Splunk, EDR et réponse aux incidents.",
  };
};

try {
  const first = await hydrateOfferSource("https://jobs.example/soc", {
    cacheDirectory: directory,
    fetcher,
  });
  assert.equal(first.usedSnapshot, true);
  assert.equal(first.snapshotSource, "network");
  assert.match(first.offer, /cached-page-snapshot/);
  assert.match(first.offer, /SIEM Splunk/);

  const second = await hydrateOfferSource("https://jobs.example/soc", {
    cacheDirectory: directory,
    fetcher,
  });
  assert.equal(second.snapshotSource, "cache");
  assert.equal(calls, 1);

  const spontaneous = await hydrateSpontaneousSource(
    "{\"company\":\"Airbus\",\"targetRole\":\"Data\"}",
    { website: "https://careers.example" },
    { cacheDirectory: directory, fetcher }
  );
  assert.equal(spontaneous.usedSnapshot, true);
  assert.match(spontaneous.offer, /reference-url/);
} finally {
  await rm(directory, { recursive: true, force: true });
}

console.log("offer-source: ok");
