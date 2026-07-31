import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  atomicWriteFile,
  isPrivateOrLocalHostname,
  resolvePublicAddress,
  validatePublicHttpUrl,
} from "../app/backend-guards.mjs";

assert.equal(isPrivateOrLocalHostname("localhost"), true);
assert.equal(isPrivateOrLocalHostname("127.0.0.1"), true);
assert.equal(isPrivateOrLocalHostname("169.254.169.254"), true);
assert.equal(isPrivateOrLocalHostname("::1"), true);
assert.equal(isPrivateOrLocalHostname("::ffff:7f00:1"), true);
assert.equal(isPrivateOrLocalHostname("8.8.8.8"), false);
assert.equal(isPrivateOrLocalHostname("jobs.example.com"), false);

assert.equal(
  validatePublicHttpUrl("https://jobs.example.com/poste"),
  "https://jobs.example.com/poste"
);
assert.throws(
  () => validatePublicHttpUrl("http://127.0.0.1/admin"),
  /locale ou privée/i
);
assert.throws(
  () => validatePublicHttpUrl("https://user:secret@jobs.example.com/poste"),
  /identifiant ni de mot de passe/i
);

await assert.rejects(
  () => resolvePublicAddress("jobs.example.com", async () => [
    { address: "203.0.113.8", family: 4 },
    { address: "127.0.0.1", family: 4 },
  ]),
  /adresse locale ou privée/i
);
assert.deepEqual(
  await resolvePublicAddress("jobs.example.com", async () => [
    { address: "8.8.8.8", family: 4 },
    { address: "2001:4860:4860::8888", family: 6 },
  ]),
  { address: "8.8.8.8", family: 4 }
);
assert.deepEqual(
  await resolvePublicAddress("[2001:4860:4860::8888]"),
  { address: "2001:4860:4860::8888", family: 6 }
);

const directory = await mkdtemp(path.join(tmpdir(), "openapply-atomic-"));
const destination = path.join(directory, "state.json");
const payloads = Array.from({ length: 12 }, (_, index) => JSON.stringify({
  index,
  value: String(index).repeat(8_000),
}));
try {
  await Promise.all(payloads.map((payload) => atomicWriteFile(destination, payload, "utf8")));
  const finalPayload = await readFile(destination, "utf8");
  assert.equal(payloads.includes(finalPayload), true);
  assert.deepEqual((await readdir(directory)).sort(), ["state.json"]);
} finally {
  await rm(directory, { recursive: true, force: true });
}

console.log("backend-guards: ok");
