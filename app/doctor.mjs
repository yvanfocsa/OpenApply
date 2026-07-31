#!/usr/bin/env node

import { constants as fsConstants } from "node:fs";
import { access, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  execPortable,
  platformLabel,
  portableEnvironment,
  pythonCommandArgs,
  resolveCommand,
  resolveFirstCommand,
  resolvePythonRuntime,
} from "./platform.mjs";

const REQUIRED_PYTHON_MODULES = [
  { importName: "docx", packageName: "python-docx" },
  { importName: "pypdf", packageName: "pypdf" },
  { importName: "fitz", packageName: "PyMuPDF" },
];

const OPTIONAL_PROVIDERS = {
  codex: "codex",
  antigravity: "agy",
  gemini: "gemini",
  claude: "claude",
  copilot: "copilot",
  hermes: "hermes",
  ollama: "ollama",
};

export function parseMajorVersion(value) {
  const match = String(value || "").match(/(?:^|\s|v)(\d+)(?:\.|\s|$)/i);
  return match ? Number.parseInt(match[1], 10) : 0;
}

export function installationHints(platform = process.platform) {
  if (platform === "win32") {
    return {
      node: "winget install OpenJS.NodeJS.LTS",
      python: "winget install Python.Python.3.12",
      libreOffice: "winget install TheDocumentFoundation.LibreOffice",
      modules: "npm run setup",
    };
  }
  if (platform === "darwin") {
    return {
      node: "brew install node",
      python: "brew install python",
      libreOffice: "brew install --cask libreoffice",
      modules: "npm run setup",
    };
  }
  return {
    node: "Installe Node.js 20+ depuis https://nodejs.org/",
    python: "sudo apt install python3 python3-venv python3-pip",
    libreOffice: "sudo apt install libreoffice",
    modules: "npm run setup",
  };
}

async function commandVersion(command, args, { environment, platform }) {
  if (!command) return "";
  try {
    const { stdout, stderr } = await execPortable(command, args, {
      env: environment,
      timeout: 10_000,
      maxBuffer: 128 * 1024,
      platform,
    });
    return `${stdout}\n${stderr}`.trim().split(/\r?\n/)[0] || "";
  } catch {
    return "";
  }
}

async function inspectPythonModules(command, { environment, platform }) {
  if (!command) {
    return {
      ready: false,
      installed: [],
      missing: REQUIRED_PYTHON_MODULES.map(({ packageName }) => packageName),
    };
  }
  const script = [
    "import importlib.util, json",
    `names = ${JSON.stringify(REQUIRED_PYTHON_MODULES.map(({ importName }) => importName))}`,
    "print(json.dumps({name: importlib.util.find_spec(name) is not None for name in names}))",
  ].join("; ");
  try {
    const { stdout } = await execPortable(
      command,
      pythonCommandArgs(command, ["-c", script], platform),
      {
        env: environment,
        timeout: 15_000,
        maxBuffer: 64 * 1024,
        platform,
      }
    );
    const availability = JSON.parse(stdout.trim());
    const installed = REQUIRED_PYTHON_MODULES
      .filter(({ importName }) => availability[importName])
      .map(({ packageName }) => packageName);
    const missing = REQUIRED_PYTHON_MODULES
      .filter(({ importName }) => !availability[importName])
      .map(({ packageName }) => packageName);
    return { ready: missing.length === 0, installed, missing };
  } catch {
    return {
      ready: false,
      installed: [],
      missing: REQUIRED_PYTHON_MODULES.map(({ packageName }) => packageName),
    };
  }
}

async function nearestExistingDirectory(target) {
  let current = path.resolve(target);
  while (true) {
    try {
      const information = await stat(current);
      if (information.isDirectory()) return current;
    } catch {}
    const parent = path.dirname(current);
    if (parent === current) return "";
    current = parent;
  }
}

async function writableTarget(target) {
  const existingDirectory = await nearestExistingDirectory(target);
  if (!existingDirectory) return false;
  try {
    await access(existingDirectory, fsConstants.W_OK);
    return true;
  } catch {
    return false;
  }
}

export async function createDoctorReport({
  platform = process.platform,
  env = process.env,
  projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
  homeDir,
} = {}) {
  const environment = portableEnvironment({ ...env, NO_COLOR: "1" }, { platform, homeDir });
  const resolveOptions = { platform, env: environment, ...(homeDir ? { homeDir } : {}) };
  const npm = await resolveCommand("npm", resolveOptions);
  const pythonRuntime = await resolvePythonRuntime({
    platform,
    env: environment,
    projectDirectory,
    ...(homeDir ? { homeDir } : {}),
  });
  const python = pythonRuntime.command;
  const libreOffice = await resolveFirstCommand(["soffice", "libreoffice"], resolveOptions);
  const nodeVersion = process.versions.node;
  const npmVersion = await commandVersion(npm, ["--version"], { environment, platform });
  const pythonVersion = await commandVersion(
    python,
    pythonCommandArgs(python, ["--version"], platform),
    { environment, platform }
  );
  const pythonModules = await inspectPythonModules(python, { environment, platform });
  const dataDirectory = path.resolve(env.OPENAPPLY_DATA_DIR || path.join(projectDirectory, ".openapply"));
  const generatedDirectory = path.resolve(projectDirectory, "generated");
  const providers = {};
  for (const [id, executable] of Object.entries(OPTIONAL_PROVIDERS)) {
    const command = await resolveCommand(executable, resolveOptions);
    providers[id] = { installed: Boolean(command), command };
  }
  const report = {
    platform: platformLabel(platform),
    platformId: platform,
    projectDirectory,
    node: {
      ready: parseMajorVersion(nodeVersion) >= 20,
      minimum: "20",
      version: nodeVersion,
      command: process.execPath,
    },
    npm: {
      ready: Boolean(npm),
      version: npmVersion,
      command: npm,
    },
    python: {
      ready: Boolean(python) && parseMajorVersion(pythonVersion) >= 3,
      modulesReady: pythonModules.ready,
      installedModules: pythonModules.installed,
      missingModules: pythonModules.missing,
      command: python,
      version: pythonVersion,
    },
    libreOffice: {
      ready: Boolean(libreOffice),
      command: libreOffice,
      version: await commandVersion(libreOffice, ["--version"], { environment, platform }),
    },
    storage: {
      ready: await writableTarget(dataDirectory) && await writableTarget(generatedDirectory),
      dataDirectory,
      generatedDirectory,
    },
    providers,
    hints: installationHints(platform),
  };
  report.ready = report.node.ready
    && report.npm.ready
    && report.python.ready
    && report.python.modulesReady
    && report.libreOffice.ready
    && report.storage.ready;
  return report;
}

export function formatDoctorReport(report, { colors = false } = {}) {
  const output = [];
  const icon = (ready, optional = false) => {
    if (ready) return colors ? "\u001b[32m[OK]\u001b[0m" : "[OK]";
    if (optional) return colors ? "\u001b[36m[OPTIONNEL]\u001b[0m" : "[OPTIONNEL]";
    return colors ? "\u001b[31m[À CORRIGER]\u001b[0m" : "[À CORRIGER]";
  };
  const line = (ready, label, detail = "", optional = false) => {
    output.push(`${icon(ready, optional)} ${label}${detail ? ` : ${detail}` : ""}`);
  };
  output.push(`OpenApply, diagnostic ${report.platform}`);
  output.push("");
  line(report.node.ready, "Node.js", `${report.node.version} (minimum ${report.node.minimum})`);
  line(report.npm.ready, "npm", report.npm.version || report.npm.command);
  line(report.python.ready, "Python 3", report.python.version || report.python.command);
  line(
    report.python.modulesReady,
    "Modules Python",
    report.python.modulesReady
      ? "python-docx, pypdf et PyMuPDF"
      : `manquants : ${report.python.missingModules.join(", ")}`
  );
  line(report.libreOffice.ready, "LibreOffice", report.libreOffice.version || report.libreOffice.command);
  line(report.storage.ready, "Dossiers de travail", report.storage.dataDirectory);
  output.push("");
  output.push("Moteurs IA détectés (un seul suffit)");
  for (const [id, provider] of Object.entries(report.providers)) {
    line(provider.installed, id, provider.installed ? provider.command : "non détecté", true);
  }
  if (!report.ready) {
    output.push("");
    output.push("Corrections recommandées");
    if (!report.node.ready || !report.npm.ready) output.push(`- Node.js/npm : ${report.hints.node}`);
    if (!report.python.ready) output.push(`- Python : ${report.hints.python}`);
    if (!report.python.modulesReady) output.push(`- Modules Python : ${report.hints.modules}`);
    if (!report.libreOffice.ready) output.push(`- LibreOffice : ${report.hints.libreOffice}`);
    if (!report.storage.ready) output.push("- Vérifie les droits d’écriture du dossier du projet et de OPENAPPLY_DATA_DIR.");
    output.push("Puis relance npm run doctor.");
  } else {
    output.push("");
    output.push("Installation prête. Lance OpenApply avec npm start.");
  }
  return `${output.join("\n")}\n`;
}

async function main() {
  const jsonOutput = process.argv.includes("--json");
  const noColor = process.argv.includes("--no-color") || !process.stdout.isTTY || process.env.NO_COLOR;
  const report = await createDoctorReport();
  process.stdout.write(
    jsonOutput
      ? `${JSON.stringify(report, null, 2)}\n`
      : formatDoctorReport(report, { colors: !noColor })
  );
  process.exitCode = report.ready ? 0 : 1;
}

const entryPoint = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === entryPoint) {
  await main();
}
