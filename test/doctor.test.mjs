import assert from "node:assert/strict";
import {
  formatDoctorReport,
  installationHints,
  parseMajorVersion,
} from "../app/doctor.mjs";
import { virtualEnvironmentPython } from "../scripts/setup.mjs";

assert.equal(parseMajorVersion("20.19.1"), 20);
assert.equal(parseMajorVersion("v22.4.0"), 22);
assert.equal(parseMajorVersion("Python 3.12.8"), 3);
assert.equal(parseMajorVersion("inconnue"), 0);

assert.match(installationHints("win32").libreOffice, /winget/);
assert.match(installationHints("darwin").python, /brew/);
assert.match(installationHints("linux").python, /python3-venv/);
assert.equal(
  virtualEnvironmentPython("C:\\OpenApply", "win32"),
  "C:\\OpenApply\\.venv\\Scripts\\python.exe"
);
assert.equal(
  virtualEnvironmentPython("/opt/openapply", "linux"),
  "/opt/openapply/.venv/bin/python3"
);

const report = {
  platform: "Linux",
  node: { ready: true, version: "22.1.0", minimum: "20" },
  npm: { ready: true, version: "10.8.0", command: "/usr/bin/npm" },
  python: {
    ready: true,
    modulesReady: false,
    missingModules: ["PyMuPDF"],
    version: "Python 3.12.1",
    command: "/usr/bin/python3",
  },
  libreOffice: { ready: false, version: "", command: "" },
  storage: { ready: true, dataDirectory: "/tmp/openapply" },
  providers: {
    codex: { installed: true, command: "/usr/bin/codex" },
    ollama: { installed: false, command: "" },
  },
  hints: installationHints("linux"),
  ready: false,
};
const formatted = formatDoctorReport(report);
assert.match(formatted, /\[À CORRIGER\] Modules Python : manquants : PyMuPDF/);
assert.match(formatted, /\[OPTIONNEL\] ollama : non détecté/);
assert.match(formatted, /sudo apt install libreoffice/);
assert.doesNotMatch(formatted, /\u001b/);

console.log("doctor: ok");
