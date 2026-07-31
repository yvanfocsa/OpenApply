import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDirectory = path.join(projectDirectory, "app", "public");
const html = readFileSync(path.join(publicDirectory, "index.html"), "utf8");
const client = readFileSync(path.join(publicDirectory, "app.js"), "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const idSet = new Set(ids);

assert.equal(idSet.size, ids.length, "Chaque identifiant HTML doit être unique.");

for (const match of client.matchAll(/document\.querySelector\("#([^"]+)"\)/g)) {
  assert.ok(idSet.has(match[1]), `Le sélecteur #${match[1]} ne correspond à aucun élément HTML.`);
}

for (const match of html.matchAll(/\b(?:aria-controls|aria-labelledby|aria-describedby)="([^"]+)"/g)) {
  for (const referencedId of match[1].split(/\s+/).filter(Boolean)) {
    assert.ok(idSet.has(referencedId), `La référence ARIA ${referencedId} est introuvable.`);
  }
}

for (const match of html.matchAll(/\bfor="([^"]+)"/g)) {
  assert.ok(idSet.has(match[1]), `Le label cible un champ absent : ${match[1]}.`);
}

for (const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="\/([^"]+)"/g)) {
  const assetPath = match[1].replace(/\?.*$/, "");
  assert.ok(existsSync(path.join(publicDirectory, assetPath)), `La ressource ${assetPath} est absente.`);
}

assert.doesNotMatch(html, /—/, "Le texte de l’interface ne doit pas contenir de tiret cadratin.");
assert.doesNotMatch(client, /["'`]([^"'`\n]*—[^"'`\n]*)["'`]/, "Les messages de l’interface ne doivent pas contenir de tiret cadratin.");

console.log("frontend-contract: ok");
