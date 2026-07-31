import assert from "node:assert/strict";
import {
  browserLaunchSpec,
  documentRuntimeReady,
  isOpenApplyPage,
  validatedPort,
} from "../scripts/start.mjs";

assert.equal(validatedPort("4173"), 4173);
assert.equal(validatedPort(8080), 8080);
assert.throws(() => validatedPort("4173abc"), /PORT/);
assert.throws(() => validatedPort("0"), /PORT/);
assert.throws(() => validatedPort("65536"), /PORT/);

assert.deepEqual(
  browserLaunchSpec("darwin", "http://localhost:4173"),
  { command: "/usr/bin/open", args: ["http://localhost:4173"] }
);
const windows = browserLaunchSpec("win32", "http://localhost:4173", {
  ComSpec: "C:\\Windows\\System32\\cmd.exe",
});
assert.equal(windows.command, "C:\\Windows\\System32\\cmd.exe");
assert.match(windows.args.at(-1), /start "" "http:\/\/localhost:4173"/);
assert.equal(browserLaunchSpec("linux", "http://localhost:4173").command, "xdg-open");

assert.equal(isOpenApplyPage("<title>OpenApply | Candidatures ciblées</title>"), true);
assert.equal(isOpenApplyPage("<title>Une autre application</title>"), false);
assert.equal(await documentRuntimeReady("/dossier/inexistant/openapply", "linux"), false);

console.log("start: ok");
