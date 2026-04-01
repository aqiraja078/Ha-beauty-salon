/* Remove or rename .next — on Windows, rename often works when rm fails (locked trace). */
const fs = require("fs");
const path = require("path");

const root = process.cwd();

function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    /* spin */
  }
}

function tryRemoveDir(dirPath) {
  for (let i = 0; i < 12; i++) {
    try {
      if (!fs.existsSync(dirPath)) return true;
      fs.rmSync(dirPath, { recursive: true, force: true });
      return true;
    } catch {
      sleep(180 + i * 40);
    }
  }
  return false;
}

/** Best-effort: delete previous stale folders left after rename. */
function sweepStaleNextDirs() {
  let names;
  try {
    names = fs.readdirSync(root);
  } catch {
    return;
  }
  for (const name of names) {
    if (name.startsWith(".next.stale.") || name.startsWith(".next.old.")) {
      tryRemoveDir(path.join(root, name));
    }
  }
}

const dir = path.join(root, ".next");

if (!fs.existsSync(dir)) {
  sweepStaleNextDirs();
  process.exit(0);
}

sweepStaleNextDirs();

const staleName = `.next.stale.${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const stalePath = path.join(root, staleName);

let renamed = false;
for (let i = 0; i < 20; i++) {
  try {
    fs.renameSync(dir, stalePath);
    renamed = true;
    break;
  } catch {
    sleep(150 + i * 35);
  }
}

if (renamed) {
  console.log(
    `[clean-next] Renamed .next → ${staleName} (fresh build will use a new .next).`
  );
  tryRemoveDir(stalePath);
  process.exit(0);
}

if (tryRemoveDir(dir)) {
  process.exit(0);
}

console.error(
  "[clean-next] Still locked. Close every terminal running `next dev` / `next start`, stop Cursor’s file watcher on this folder if needed, then run `npm run clean` again or delete the .next folder in Explorer.\n"
);
process.exit(1);
