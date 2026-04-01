const { spawnSync } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");
const cleanScript = path.join(__dirname, "clean-next.cjs");

spawnSync(process.execPath, [cleanScript], { stdio: "inherit", cwd: root });

const build = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  cwd: root,
  shell: true,
  env: process.env,
});

process.exit(
  build.status !== null && build.status !== undefined ? build.status : 1
);
