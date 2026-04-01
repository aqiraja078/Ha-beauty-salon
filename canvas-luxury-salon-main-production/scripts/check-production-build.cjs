const fs = require("fs");
const path = require("path");

const buildId = path.join(process.cwd(), ".next", "BUILD_ID");

if (fs.existsSync(buildId)) {
  process.exit(0);
}

console.error(`
No production build found in .next/

Do one of the following:

  Local development (hot reload):
    npm run dev

  Production server (after building):
    npm run build
    npm start

`);
process.exit(1);
