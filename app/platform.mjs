import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

function pathImplementation(platform) {
  return platform === "win32" ? path.win32 : path.posix;
}

export function executableExtensions(platform = process.platform, pathext = process.env.PATHEXT) {
  if (platform !== "win32") return [""];
  const extensions = String(pathext || ".EXE;.CMD;.BAT")
    .split(";")
    .map((extension) => extension.trim())
    .filter(Boolean)
    .map((extension) => extension.startsWith(".") ? extension : `.${extension}`);
  return [...new Set([".EXE", ".CMD", ".BAT", ...extensions].map((extension) => extension.toUpperCase()))];
}

export function executableSearchDirectories({
  platform = process.platform,
  env = process.env,
  homeDir = homedir(),
} = {}) {
  const pathApi = pathImplementation(platform);
  const delimiter = platform === "win32" ? ";" : ":";
  const pathValue = env.PATH || env.Path || env.path || "";
  const directories = String(pathValue).split(delimiter).filter(Boolean);

  if (platform === "win32") {
    const localAppData = env.LOCALAPPDATA || pathApi.join(homeDir, "AppData", "Local");
    const roamingAppData = env.APPDATA || pathApi.join(homeDir, "AppData", "Roaming");
    const programFiles = env.ProgramFiles || "C:\\Program Files";
    const programFilesX86 = env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";
    directories.push(
      pathApi.join(localAppData, "agy", "bin"),
      pathApi.join(localAppData, "Programs", "LibreOffice", "program"),
      pathApi.join(roamingAppData, "npm"),
      pathApi.join(programFiles, "nodejs"),
      pathApi.join(programFiles, "LibreOffice", "program"),
      pathApi.join(programFilesX86, "LibreOffice", "program"),
      pathApi.join(homeDir, ".local", "bin")
    );
  } else {
    directories.push(
      pathApi.join(homeDir, ".local", "bin"),
      "/usr/local/bin",
      "/opt/homebrew/bin"
    );
    if (platform === "darwin") {
      directories.push("/Applications/LibreOffice.app/Contents/MacOS");
    }
  }
  return [...new Set(directories.filter(Boolean))];
}

export function portableEnvironment(
  env = process.env,
  {
    platform = process.platform,
    homeDir = homedir(),
  } = {}
) {
  const result = { ...env };
  const pathKey = Object.keys(result).find((key) => key.toLowerCase() === "path") || "PATH";
  const delimiter = platform === "win32" ? ";" : ":";
  result[pathKey] = executableSearchDirectories({ platform, env, homeDir }).join(delimiter);
  if (pathKey !== "PATH") delete result.PATH;
  return result;
}

export async function resolveCommand(
  command,
  {
    platform = process.platform,
    env = process.env,
    homeDir = homedir(),
    accessFunction = access,
  } = {}
) {
  const value = String(command || "").trim();
  if (!value) return "";
  const pathApi = pathImplementation(platform);
  const hasPath = pathApi.isAbsolute(value) || value.includes("/") || value.includes("\\");
  const extensions = executableExtensions(platform, env.PATHEXT);
  const hasKnownExtension = platform === "win32" && extensions.some(
    (extension) => value.toUpperCase().endsWith(extension)
  );
  const names = platform === "win32" && !hasKnownExtension
    ? extensions.map((extension) => `${value}${extension}`)
    : [value];
  const candidates = hasPath
    ? names
    : executableSearchDirectories({ platform, env, homeDir })
        .flatMap((directory) => names.map((name) => pathApi.join(directory, name)));
  for (const candidate of candidates) {
    try {
      await accessFunction(candidate);
      return candidate;
    } catch {}
  }
  return "";
}

export async function resolveFirstCommand(commands, options = {}) {
  for (const command of commands) {
    const resolved = await resolveCommand(command, options);
    if (resolved) return resolved;
  }
  return "";
}

export function pythonCommandCandidates({
  platform = process.platform,
  env = process.env,
  homeDir = homedir(),
  projectDirectory = process.cwd(),
} = {}) {
  const pathApi = pathImplementation(platform);
  const candidates = [];
  if (env.OPENAPPLY_PYTHON) candidates.push(env.OPENAPPLY_PYTHON);
  const runtimeRoot = pathApi.join(
    homeDir,
    ".cache",
    "codex-runtimes",
    "codex-primary-runtime",
    "dependencies",
    "python"
  );
  if (platform === "win32") {
    candidates.push(
      pathApi.join(projectDirectory, ".venv", "Scripts", "python.exe"),
      pathApi.join(runtimeRoot, "python.exe"),
      pathApi.join(runtimeRoot, "bin", "python.exe"),
      pathApi.join(runtimeRoot, "bin", "python3.exe"),
      "python",
      "py",
      "python3"
    );
  } else {
    candidates.push(
      pathApi.join(projectDirectory, ".venv", "bin", "python3"),
      pathApi.join(runtimeRoot, "bin", "python3"),
      pathApi.join(runtimeRoot, "bin", "python"),
      "python3",
      "python"
    );
  }
  return [...new Set(candidates.filter(Boolean))];
}

export function pythonCommandArgs(
  command,
  args = [],
  platform = process.platform
) {
  const pathApi = pathImplementation(platform);
  const isWindowsLauncher = platform === "win32"
    && /^py(?:\.exe)?$/i.test(pathApi.basename(String(command || "")));
  return isWindowsLauncher ? ["-3", ...args] : args;
}

export async function resolvePythonRuntime({
  platform = process.platform,
  env = process.env,
  homeDir = homedir(),
  projectDirectory = process.cwd(),
  requiredModules = ["docx", "pypdf", "fitz"],
  timeout = 15_000,
} = {}) {
  let firstCommand = "";
  let lastError = "";
  for (const candidate of pythonCommandCandidates({
    platform,
    env,
    homeDir,
    projectDirectory,
  })) {
    const command = await resolveCommand(candidate, { platform, env, homeDir });
    if (!command) continue;
    if (!firstCommand) firstCommand = command;
    const moduleStatement = requiredModules.length
      ? `import ${requiredModules.join(", ")}`
      : "pass";
    try {
      await execPortable(
        command,
        pythonCommandArgs(command, ["-c", moduleStatement], platform),
        {
          env: portableEnvironment(env, { platform, homeDir }),
          timeout,
          maxBuffer: 64 * 1024,
          platform,
        }
      );
      return {
        command,
        ready: true,
        modulesReady: true,
        missingModules: [],
        error: "",
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error || "");
    }
  }
  return {
    command: firstCommand,
    ready: Boolean(firstCommand),
    modulesReady: false,
    missingModules: requiredModules,
    error: lastError,
  };
}

function quoteWindowsCommandArgument(value) {
  const escaped = String(value)
    .replace(/%/g, "%%")
    .replace(/!/g, "^!")
    .replace(/"/g, "\"\"");
  return `"${escaped}"`;
}

export function portableSpawnSpec(
  command,
  args = [],
  {
    platform = process.platform,
    env = process.env,
  } = {}
) {
  if (platform !== "win32" || !/\.(?:cmd|bat)$/i.test(command)) {
    return { command, args, windowsHide: platform === "win32" };
  }
  const commandProcessor = env.ComSpec || env.COMSPEC || "cmd.exe";
  const commandLine = [command, ...args].map(quoteWindowsCommandArgument).join(" ");
  return {
    command: commandProcessor,
    args: ["/d", "/v:off", "/s", "/c", commandLine],
    windowsHide: true,
  };
}

export function spawnPortable(command, args = [], options = {}) {
  const spec = portableSpawnSpec(command, args, {
    platform: options.platform || process.platform,
    env: options.env || process.env,
  });
  const { platform: _platform, ...spawnOptions } = options;
  return spawn(spec.command, spec.args, {
    ...spawnOptions,
    windowsHide: spec.windowsHide,
  });
}

export function terminatePortableProcess(child, platform = process.platform) {
  if (!child || child.exitCode !== null) return;
  if (platform === "win32" && child.pid) {
    const taskkill = path.win32.join(process.env.SystemRoot || "C:\\Windows", "System32", "taskkill.exe");
    const killer = spawn(taskkill, ["/pid", String(child.pid), "/t", "/f"], {
      stdio: "ignore",
      windowsHide: true,
    });
    killer.on("error", () => {
      if (child.exitCode === null) child.kill();
    });
    killer.unref();
    return;
  }
  child.kill("SIGTERM");
}

export function execPortable(
  command,
  args = [],
  {
    env = process.env,
    timeout = 0,
    maxBuffer = 1024 * 1024,
    platform = process.platform,
  } = {}
) {
  return new Promise((resolve, reject) => {
    const child = spawnPortable(command, args, {
      env,
      platform,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      if (error) reject(error);
      else resolve(result);
    };
    const append = (current, chunk) => {
      const next = current + chunk;
      if (Buffer.byteLength(next) > maxBuffer) {
        terminatePortableProcess(child, platform);
        finish(new Error("La sortie de la commande dépasse la taille autorisée."));
        return current;
      }
      return next;
    };
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout = append(stdout, chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr = append(stderr, chunk);
    });
    child.on("error", (error) => finish(error));
    child.on("close", (code) => {
      if (code === 0) finish(null, { stdout, stderr });
      else {
        const error = new Error(stderr.trim() || stdout.trim() || `Commande interrompue avec le code ${code}.`);
        error.code = code;
        finish(error);
      }
    });
    const timer = timeout > 0
      ? setTimeout(() => {
          terminatePortableProcess(child, platform);
          finish(new Error("Délai dépassé pendant l’exécution de la commande."));
        }, timeout)
      : null;
    timer?.unref();
  });
}

export function platformLabel(platform = process.platform) {
  if (platform === "win32") return "Windows";
  if (platform === "darwin") return "macOS";
  return "Linux";
}
