#!/usr/bin/env node

import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  portableEnvironment,
  pythonCommandArgs,
  resolveFirstCommand,
  spawnPortable,
} from "../app/platform.mjs";

const PROJECT_DIRECTORY = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function virtualEnvironmentPython(
  projectDirectory,
  platform = process.platform
) {
  return platform === "win32"
    ? path.win32.join(projectDirectory, ".venv", "Scripts", "python.exe")
    : path.posix.join(projectDirectory, ".venv", "bin", "python3");
}

function run(command, args, { env = process.env } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawnPortable(command, args, {
      cwd: PROJECT_DIRECTORY,
      env,
      stdio: "inherit",
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`La commande a échoué avec le code ${code}.`));
    });
  });
}

function stop(message) {
  process.stderr.write(`\nInstallation interrompue : ${message}\n`);
  process.stderr.write("Consulte la section Installation de README.md, puis relance npm run setup.\n");
  process.exitCode = 1;
}

async function main() {
  const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
  if (nodeMajor < 20) {
    stop(`Node.js ${process.versions.node} est trop ancien. OpenApply nécessite Node.js 20 ou plus récent.`);
    return;
  }

  const environment = portableEnvironment(process.env);
  const venvPython = virtualEnvironmentPython(PROJECT_DIRECTORY);

  try {
    if (!existsSync(venvPython)) {
      process.stdout.write("Création de l’environnement Python isolé .venv...\n");
      const pythonCandidates = process.platform === "win32"
        ? [process.env.OPENAPPLY_PYTHON, "py", "python", "python3"]
        : [process.env.OPENAPPLY_PYTHON, "python3", "python"];
      const basePython = await resolveFirstCommand(pythonCandidates.filter(Boolean), {
        env: environment,
      });
      if (!basePython) {
        stop("Python 3 est introuvable.");
        return;
      }
      await run(
        basePython,
        pythonCommandArgs(basePython, ["-m", "venv", ".venv"]),
        { env: environment }
      );
    } else {
      process.stdout.write("Environnement Python .venv déjà présent.\n");
    }

    process.stdout.write("Installation des modules documentaires...\n");
    await run(venvPython, [
      "-m",
      "pip",
      "install",
      "--disable-pip-version-check",
      "-r",
      "requirements.txt",
    ], { env: environment });

    process.stdout.write("\nVérification de l’installation...\n");
    await run(process.execPath, ["app/doctor.mjs"], { env: environment });
  } catch (error) {
    stop(error instanceof Error ? error.message : String(error));
    return;
  }

  process.stdout.write("\nOpenApply est installé. Lance-le avec npm start.\n");
}

const entryPoint = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === entryPoint) {
  await main();
}
