#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { classifyJob } from "../../../../app/job-classifier.mjs";

function optionValue(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? String(args[index + 1] || "") : "";
}

const args = process.argv.slice(2);
const filePath = optionValue(args, "--file");
const directText = optionValue(args, "--text");
const contract = optionValue(args, "--contract").toLowerCase();

if (!filePath && !directText) {
  process.stderr.write("Utilisation : classify-job.mjs --file offre.txt | --text \"texte\" [--contract cdi|alternance]\n");
  process.exit(2);
}

if (contract && !["cdi", "alternance"].includes(contract)) {
  process.stderr.write("Le contrat doit être cdi ou alternance.\n");
  process.exit(2);
}

const text = filePath ? await readFile(filePath, "utf8") : directText;
const result = classifyJob(text, { contractOverride: contract || undefined });
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
