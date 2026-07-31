#!/usr/bin/env node

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { virtualEnvironmentPython } from "./setup.mjs";

const PROJECT_DIRECTORY = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OPENAPPLY_SIGNATURE = /<title>\s*OpenApply\b/i;

export function validatedPort(value = "4173") {
  const port = Number.parseInt(String(value), 10);
  if (!Number.isInteger(port) || String(port) !== String(value).trim() || port < 1 || port > 65_535) {
    throw new Error(`PORT doit être un nombre entier entre 1 et 65535. Valeur reçue : ${value}`);
  }
  return port;
}

export function browserLaunchSpec(platform, url, env = process.env) {
  if (platform === "darwin") return { command: "/usr/bin/open", args: [url] };
  if (platform === "win32") {
    return {
      command: env.ComSpec || env.COMSPEC || "cmd.exe",
      args: ["/d", "/s", "/c", `start "" "${url}"`],
    };
  }
  return { command: "xdg-open", args: [url] };
}

export function isOpenApplyPage(body) {
  return OPENAPPLY_SIGNATURE.test(String(body || ""));
}

export function documentRuntimeReady(
  projectDirectory = PROJECT_DIRECTORY,
  platform = process.platform
) {
  const python = virtualEnvironmentPython(projectDirectory, platform);
  if (!existsSync(python)) return Promise.resolve(false);
  return new Promise((resolve) => {
    const child = spawn(python, ["-c", "import docx, pypdf, fitz"], {
      cwd: projectDirectory,
      stdio: "ignore",
      windowsHide: true,
    });
    child.once("error", () => resolve(false));
    child.once("close", (code) => resolve(code === 0));
  });
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function probe(url, timeout = 1_500) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(timeout) });
    const body = await response.text();
    return {
      reachable: true,
      openApply: response.ok && isOpenApplyPage(body),
    };
  } catch {
    return { reachable: false, openApply: false };
  }
}

function openBrowser(url) {
  const spec = browserLaunchSpec(process.platform, url);
  try {
    const opener = spawn(spec.command, spec.args, {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    });
    opener.on("error", () => {
      process.stdout.write(`Ouvre ${url} dans ton navigateur.\n`);
    });
    opener.unref();
  } catch {
    process.stdout.write(`Ouvre ${url} dans ton navigateur.\n`);
  }
}

function runSetup() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(PROJECT_DIRECTORY, "scripts", "setup.mjs")], {
      cwd: PROJECT_DIRECTORY,
      env: process.env,
      stdio: "inherit",
      windowsHide: true,
    });
    child.once("error", () => resolve(1));
    child.once("close", (code) => resolve(code ?? 1));
  });
}

async function prepareFirstLaunch() {
  const skipSetup = process.argv.includes("--skip-setup") || process.env.OPENAPPLY_SKIP_SETUP === "1";
  if (skipSetup || await documentRuntimeReady()) return;
  process.stdout.write("\nPremier lancement détecté. Préparation automatique des documents...\n");
  const setupCode = await runSetup();
  if (setupCode !== 0) {
    process.stderr.write(
      "\nLa préparation documentaire est incomplète. OpenApply va tout de même s’ouvrir pour afficher le diagnostic et les étapes de correction.\n\n"
    );
  }
}

async function waitUntilReady(url, child, timeout = 20_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline && child.exitCode === null) {
    const status = await probe(url);
    if (status.openApply) return true;
    await delay(250);
  }
  return false;
}

async function main() {
  const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
  if (nodeMajor < 20) {
    throw new Error(`Node.js ${process.versions.node} est trop ancien. Installe Node.js 20 ou plus récent.`);
  }
  const port = validatedPort(process.env.PORT || "4173");
  const url = `http://localhost:${port}`;
  const loopbackUrl = `http://127.0.0.1:${port}`;
  const noBrowser = process.argv.includes("--no-open") || process.env.OPENAPPLY_NO_BROWSER === "1";
  const current = await probe(loopbackUrl);
  if (current.openApply) {
    process.stdout.write(`OpenApply fonctionne déjà sur ${url}.\n`);
    if (!noBrowser) openBrowser(url);
    return;
  }
  if (current.reachable) {
    throw new Error(`Le port ${port} est occupé par une autre application. Choisis un autre PORT.`);
  }

  await prepareFirstLaunch();

  const child = spawn(process.execPath, [path.join(PROJECT_DIRECTORY, "app", "server.mjs")], {
    cwd: PROJECT_DIRECTORY,
    env: { ...process.env, PORT: String(port) },
    stdio: "inherit",
    windowsHide: true,
  });
  const forwardSignal = (signal) => {
    if (child.exitCode === null) child.kill(signal);
  };
  process.once("SIGINT", () => forwardSignal("SIGINT"));
  process.once("SIGTERM", () => forwardSignal("SIGTERM"));

  const ready = await waitUntilReady(loopbackUrl, child);
  if (ready) {
    if (!noBrowser) openBrowser(url);
  } else if (child.exitCode === null) {
    process.stderr.write(`OpenApply démarre plus lentement que prévu. Vérifie ${url} dans quelques secondes.\n`);
  }

  const exitCode = await new Promise((resolve) => {
    if (child.exitCode !== null) resolve(child.exitCode);
    else child.once("close", (code) => resolve(code ?? 1));
    child.once("error", () => resolve(1));
  });
  process.exitCode = exitCode;
}

const entryPoint = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === entryPoint) {
  try {
    await main();
  } catch (error) {
    process.stderr.write(`Impossible de lancer OpenApply : ${error instanceof Error ? error.message : String(error)}\n`);
    process.stderr.write("Lance npm run doctor pour obtenir un diagnostic détaillé.\n");
    process.exitCode = 1;
  }
}
