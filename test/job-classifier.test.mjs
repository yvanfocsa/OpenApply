import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { classifyJob, classificationForPrompt } from "../app/job-classifier.mjs";

const evalPath = new URL("../.agents/skills/classify-job/evals/evals.json", import.meta.url);
const evaluation = JSON.parse(await readFile(evalPath, "utf8"));

for (const testCase of evaluation.cases) {
  const result = classifyJob(testCase.input, {
    contractOverride: testCase.contractOverride,
  });
  if (testCase.expect.family) {
    assert.equal(result.family.id, testCase.expect.family, `${testCase.id}: famille`);
  }
  if (testCase.expect.contract) {
    assert.equal(result.contract.value, testCase.expect.contract, `${testCase.id}: contrat`);
  }
  if (testCase.expect.contractConfidence) {
    assert.equal(result.contract.confidence, testCase.expect.contractConfidence, `${testCase.id}: confiance contrat`);
  }
  if (testCase.expect.tools) {
    assert.deepEqual(result.tools, testCase.expect.tools, `${testCase.id}: outils`);
  }
}

const cloud = classifyJob("CDI DevSecOps avec Terraform, Kubernetes, Docker et contrôles SAST dans GitLab CI.");
assert.equal(cloud.family.id, "cloud-devsecops");
assert.deepEqual(cloud.tools, ["Docker", "GitLab CI", "Kubernetes", "Terraform"]);

assert.equal(classifyJob("Staff Security Engineer").seniority, "senior");
assert.equal(classifyJob("Director, Cloud Security").seniority, "senior");
assert.equal(classifyJob({ title: "Security Engineer", description: "At least 4+ years of experience required." }).seniority, "senior");

const nurse = classifyJob("Infirmière en service de médecine, soins aux patients et travail en équipe.");
assert.equal(nurse.family.id, "health-care");

const teacher = classifyJob("Professeur de mathématiques, préparation des cours et pédagogie différenciée.");
assert.equal(teacher.family.id, "education-research");

const electrician = classifyJob("Électricien bâtiment pour installation sur chantier et maintenance.");
assert.equal(electrician.family.id, "construction-trades");

const hotel = classifyJob("Réceptionniste d'hôtel, accueil des clients et réservations.");
assert.equal(hotel.family.id, "hospitality-tourism");

const office = classifyJob("Assistante administrative, Microsoft 365 et Excel, gestion administrative.");
assert.equal(office.family.id, "administration-public");
assert.deepEqual(office.tools, ["Excel", "Microsoft 365"]);
const promptHint = classificationForPrompt(cloud);
assert.ok(promptHint.length < 1_500);
assert.match(promptHint, /cloud-devsecops/);
assert.doesNotMatch(promptHint, /match|candidat|pourcentage/i);

console.log("job-classifier: ok");
