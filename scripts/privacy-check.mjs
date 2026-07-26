import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const privateDirectories = [".openapply/", ".cv-app/", "generated/", "output/", "scratch/", "scratch_tmp/", "V2/"];
const traversalExclusions = new Set([".git", "node_modules", ".venv", ...privateDirectories.map((entry) => entry.slice(0, -1))]);

function fallbackFiles(directory = root) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && traversalExclusions.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...fallbackFiles(absolute));
    else if (entry.isFile()) files.push(path.relative(root, absolute));
  }
  return files;
}

let listed;
try {
  listed = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], {
    cwd: root,
    encoding: "utf8",
  }).split("\0").filter(Boolean);
} catch {
  listed = fallbackFiles();
}

const blockedExtensions = new Set([".docx", ".pdf", ".zip", ".pem", ".key", ".pfx", ".p12"]);
const textExtensions = new Set([
  "", ".cjs", ".cmd", ".css", ".html", ".js", ".json", ".jsonl", ".md", ".mjs",
  ".ps1", ".py", ".sh", ".txt", ".yaml", ".yml",
]);
const secretPatterns = [
  ["jeton JWT", /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g],
  ["clé privée", new RegExp(["-----BEGIN ", "PRIVATE KEY-----"].join(""), "g")],
  ["clé GitHub", /\bgh[pousr]_[A-Za-z0-9]{30,}\b/g],
  ["clé Google", /\bAIza[0-9A-Za-z_-]{30,}\b/g],
  ["identifiant France Travail", /\bPAR_[A-Za-z0-9_-]+_[a-f0-9]{48,}\b/gi],
  ["secret hexadécimal", /\b[a-f0-9]{64,}\b/gi],
];
const findings = [];

for (const relative of listed) {
  const normalized = relative.replaceAll("\\", "/");
  const lowered = normalized.toLowerCase();
  const absolute = path.join(root, relative);
  if (!existsSync(absolute) || !lstatSync(absolute).isFile()) continue;
  if (privateDirectories.some((directory) => lowered.startsWith(directory.toLowerCase()))) {
    findings.push(`${normalized}: dossier privé ajouté à Git`);
    continue;
  }
  const extension = path.extname(lowered);
  if (blockedExtensions.has(extension)) {
    findings.push(`${normalized}: format personnel ou secret interdit`);
    continue;
  }
  if (!textExtensions.has(extension) || lstatSync(absolute).size > 5_000_000) continue;
  const text = readFileSync(absolute, "utf8");
  for (const [label, pattern] of secretPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) findings.push(`${normalized}: ${label} potentiel`);
  }
}

const ignoreFile = readFileSync(path.join(root, ".gitignore"), "utf8").replaceAll("\\", "/");
for (const required of [".openapply/", "generated/", ".env", "*.docx", "*.pdf", "*.key", "*.pem"]) {
  if (!ignoreFile.split(/\r?\n/).includes(required)) findings.push(`.gitignore: protection manquante pour ${required}`);
}

if (findings.length) {
  console.error("Publication bloquée par le contrôle de confidentialité :");
  for (const finding of findings) console.error(`- ${finding}`);
  console.error("Retire ces éléments du dépôt et renouvelle tout secret réellement exposé.");
  process.exit(1);
}
console.log(`privacy-check: ok (${listed.length} fichiers publiables contrôlés)`);