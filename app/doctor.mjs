#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  execPortable,
  platformLabel,
  portableEnvironment,
  pythonCommandArgs,
  resolveCommand,
  resolveFirstCommand,
  resolvePythonRuntime,
} from "./platform.mjs";

const jsonOutput = process.argv.includes("--json");
const environment = portableEnvironment({ ...process.env, NO_COLOR: "1" });
const appDirectory = path.dirname(fileURLToPath(import.meta.url));

async function commandVersion(command, args) {
  if (!command) return "";
  try {
    const { stdout, stderr } = await execPortable(command, args, {
      env: environment,
      timeout: 10_000,
      maxBuffer: 128 * 1024,
    });
    return `${stdout}\n${stderr}`.trim().split(/\r?\n/)[0] || "";
  } catch {
    return "";
  }
}

const pythonRuntime = await resolvePythonRuntime({
  projectDirectory: path.resolve(appDirectory, ".."),
});
const python = pythonRuntime.command;

const libreOffice = await resolveFirstCommand(["soffice", "libreoffice"]);
const providerCommands = {
  codex: await resolveCommand("codex"),
  antigravity: await resolveCommand("agy"),
  gemini: await resolveCommand("gemini"),
  claude: await resolveCommand("claude"),
  copilot: await resolveCommand("copilot"),
  hermes: await resolveCommand("hermes"),
  ollama: await resolveCommand("ollama"),
};
const report = {
  platform: platformLabel(),
  node: {
    ready: Number(process.versions.node.split(".")[0]) >= 20,
    version: process.versions.node,
  },
  python: {
    ready: Boolean(python),
    modulesReady: pythonRuntime.modulesReady,
    command: python,
    version: await commandVersion(python, pythonCommandArgs(python, ["--version"])),
  },
  libreOffice: {
    ready: Boolean(libreOffice),
    command: libreOffice,
    version: await commandVersion(libreOffice, ["--version"]),
  },
  providers: Object.fromEntries(
    Object.entries(providerCommands).map(([id, command]) => [id, {
      installed: Boolean(command),
      command,
    }])
  ),
};
report.ready = report.node.ready
  && report.python.ready
  && report.python.modulesReady
  && report.libreOffice.ready;

if (jsonOutput) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  const line = (ready, label, detail = "") => {
    process.stdout.write(`${ready ? "[OK]" : "[À INSTALLER]"} ${label}${detail ? ` : ${detail}` : ""}\n`);
  };
  process.stdout.write(`OpenApply, diagnostic ${report.platform}\n\n`);
  line(report.node.ready, "Node.js", report.node.version);
  line(report.python.ready, "Python 3", report.python.version || report.python.command);
  line(report.python.modulesReady, "Modules Python", "python-docx, pypdf et PyMuPDF");
  line(report.libreOffice.ready, "LibreOffice", report.libreOffice.version || report.libreOffice.command);
  process.stdout.write("\nMoteurs détectés\n");
  for (const [id, provider] of Object.entries(report.providers)) {
    line(provider.installed, id, provider.installed ? provider.command : "");
  }
  if (!report.ready) {
    process.stdout.write("\nInstalle les dépendances manquantes puis relance npm run doctor.\n");
  }
}

process.exitCode = report.ready ? 0 : 1;
