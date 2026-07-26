import assert from "node:assert/strict";
import path from "node:path";
import {
  executableExtensions,
  executableSearchDirectories,
  platformLabel,
  portableEnvironment,
  portableSpawnSpec,
  pythonCommandArgs,
  pythonCommandCandidates,
  resolveCommand,
} from "../app/platform.mjs";

assert.deepEqual(executableExtensions("win32", ".EXE;.CMD"), [".EXE", ".CMD", ".BAT"]);
assert.deepEqual(executableExtensions("darwin"), [""]);
assert.equal(platformLabel("win32"), "Windows");
assert.equal(platformLabel("darwin"), "macOS");
assert.deepEqual(pythonCommandArgs("C:\\Windows\\py.exe", ["--version"], "win32"), ["-3", "--version"]);
assert.deepEqual(pythonCommandArgs("/usr/bin/python3", ["--version"], "darwin"), ["--version"]);

const windowsEnv = {
  Path: "C:\\Tools;C:\\Node",
  PATHEXT: ".EXE;.CMD",
  LOCALAPPDATA: "C:\\Users\\Alice\\AppData\\Local",
  APPDATA: "C:\\Users\\Alice\\AppData\\Roaming",
  ProgramFiles: "C:\\Program Files",
  "ProgramFiles(x86)": "C:\\Program Files (x86)",
  ComSpec: "C:\\Windows\\System32\\cmd.exe",
};
const windowsDirectories = executableSearchDirectories({
  platform: "win32",
  env: windowsEnv,
  homeDir: "C:\\Users\\Alice",
});
assert.ok(windowsDirectories.includes("C:\\Users\\Alice\\AppData\\Roaming\\npm"));
assert.ok(windowsDirectories.includes("C:\\Users\\Alice\\AppData\\Local\\Programs\\LibreOffice\\program"));
assert.ok(windowsDirectories.includes("C:\\Program Files\\LibreOffice\\program"));

const portableWindowsEnv = portableEnvironment(windowsEnv, {
  platform: "win32",
  homeDir: "C:\\Users\\Alice",
});
assert.match(portableWindowsEnv.Path, /LibreOffice\\program/);
assert.equal(Object.hasOwn(portableWindowsEnv, "PATH"), false);

const requested = [];
const resolved = await resolveCommand("gemini", {
  platform: "win32",
  env: windowsEnv,
  homeDir: "C:\\Users\\Alice",
  accessFunction: async (candidate) => {
    requested.push(candidate);
    if (candidate === "C:\\Users\\Alice\\AppData\\Roaming\\npm\\gemini.CMD") return;
    throw new Error("missing");
  },
});
assert.equal(resolved, "C:\\Users\\Alice\\AppData\\Roaming\\npm\\gemini.CMD");
assert.ok(requested.some((candidate) => candidate.endsWith(path.win32.join("npm", "gemini.CMD"))));

const spawnSpec = portableSpawnSpec(
  "C:\\Users\\Alice\\AppData\\Roaming\\npm\\gemini.cmd",
  ["--model", "gemini-2.5-pro"],
  { platform: "win32", env: windowsEnv }
);
assert.equal(spawnSpec.command, windowsEnv.ComSpec);
assert.deepEqual(spawnSpec.args.slice(0, 4), ["/d", "/v:off", "/s", "/c"]);
assert.match(spawnSpec.args[4], /gemini\.cmd/);

const windowsPython = pythonCommandCandidates({
  platform: "win32",
  env: {},
  homeDir: "C:\\Users\\Alice",
  projectDirectory: "C:\\OpenApply",
});
assert.ok(windowsPython.includes("C:\\OpenApply\\.venv\\Scripts\\python.exe"));
assert.ok(windowsPython.includes("C:\\Users\\Alice\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe"));

console.log("platform: ok");
