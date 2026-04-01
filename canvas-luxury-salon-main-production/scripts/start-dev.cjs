/* Always start next dev; clean is best-effort so EPERM never blocks you. */
const { spawnSync } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");
const cleanScript = path.join(__dirname, "clean-next.cjs");

const clean = spawnSync(process.execPath, [cleanScript], {
  stdio: "inherit",
  cwd: root,
});

if (clean.status !== 0) {
  console.warn(
    "\n[start-dev] Clean step skipped (see above). Starting `next dev` anyway.\n"
  );
}

const dev = spawnSync("npx", ["next", "dev", "--turbo"], {
  stdio: "inherit",
  cwd: root,
  shell: true,
  env: process.env,
});

process.exit(dev.status !== null && dev.status !== undefined ? dev.status : 1);
