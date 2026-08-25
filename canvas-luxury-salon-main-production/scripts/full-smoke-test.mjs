#!/usr/bin/env node
/**
 * Full smoke + admin CRUD test (mobile-ish page checks via viewport headers + Playwright if available).
 */
import { createRequire } from "module";

const BASE = process.env.TEST_BASE || "http://localhost:3000";
const USER = process.env.ADMIN_USERNAME || "huma-admin";
const PASS = process.env.ADMIN_PASSWORD || "HumaAdmin@123!";

const results = [];
function ok(name, detail = "") {
  results.push({ ok: true, name, detail });
  console.log(`PASS  ${name}${detail ? ` — ${detail}` : ""}`);
}
function fail(name, detail = "") {
  results.push({ ok: false, name, detail });
  console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}
function assert(cond, name, detail) {
  if (cond) ok(name, detail);
  else fail(name, detail);
}

function cookieHeader(jar) {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

function absorbSetCookie(res, jar) {
  const raw = res.headers.getSetCookie?.() || [];
  const single = res.headers.get("set-cookie");
  const list = raw.length ? raw : single ? [single] : [];
  for (const c of list) {
    const [pair] = c.split(";");
    const eq = pair.indexOf("=");
    if (eq > 0) jar.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
  }
}

async function req(path, { method = "GET", body, jar, headers = {} } = {}) {
  const h = { ...headers };
  if (jar?.size) h.Cookie = cookieHeader(jar);
  if (body !== undefined) h["Content-Type"] = "application/json";
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: h,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });
  if (jar) absorbSetCookie(res, jar);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* html */
  }
  return { res, text, json, status: res.status };
}

const PUBLIC_PAGES = [
  ["/", ["Huma", "Makeup"]],
  ["/services/hair", ["Hair"]],
  ["/services/makeup", ["Event & Party Makeup", "Bridal Barat Makeup", "Bridal Walima Makeup", "Everyday Makeup", "Signature Bridal Package Barat", "Rs. 18,000"]],
  ["/services/facial", ["Basic Facial", "Whitening / Brightening", "Advanced", "Herbal / Organic", "Bridal", "Hydra Facial", "Josn", "Rs. 1,800"]],
  ["/services/body-spa", ["Face Waxing", "Arm Waxing", "Leg Waxing", "Body Waxing", "Bikini Waxing", "Eyebrow Shaping", "Rs. 200"]],
  ["/services/nails", ["Manicure"]],
  ["/services/mehndi", ["Hand Mehndi", "Feet Mehndi", "Occasion Mehndi", "Bridal Mehndi", "Finger Mehndi", "Rs. 800", "Quote on Consult"]],
  ["/book", ["Book"]],
  ["/contact", ["Contact"]],
  ["/offers", []],
  ["/how-to-book", []],
  ["/blog", []],
  ["/courses", []],
  ["/jobs", []],
  ["/admin/login", ["Sign in", "Username", "Password"]],
];

function htmlIncludes(html, needle) {
  if (html.includes(needle)) return true;
  const decoded = html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\\u0026/g, "&");
  return decoded.includes(needle);
}

async function testPublicPages() {
  console.log("\n=== Public pages (status + content) ===");
  for (const [path, needles] of PUBLIC_PAGES) {
    const { status, text } = await req(path);
    assert(status === 200, `GET ${path}`, `status=${status}`);
    if (status === 200) {
      for (const n of needles) {
        assert(htmlIncludes(text, n), `${path} contains "${n}"`);
      }
      // Rough mobile-friendly check: no huge fixed desktop-only overflow markers we control
      assert(!text.includes("Something went wrong"), `${path} no error boundary`);
    }
  }
}

async function testAdminCrud() {
  console.log("\n=== Admin login ===");
  const jar = new Map();
  const login = await req("/api/admin/login", {
    method: "POST",
    jar,
    body: { username: USER, password: PASS },
  });
  assert(login.status === 200, "Admin login", `status=${login.status} body=${JSON.stringify(login.json)}`);
  assert(jar.has("salon_admin_session"), "Session cookie set");

  const bad = await req("/api/admin/login", {
    method: "POST",
    body: { username: USER, password: "wrong-password" },
  });
  assert(bad.status === 401 || bad.status === 400, "Bad password rejected", `status=${bad.status}`);

  // --- Blog CRUD ---
  console.log("\n=== Blog CRUD ===");
  const blogCreate = await req("/api/admin/blog", {
    method: "POST",
    jar,
    body: {
      title: "QA Test Blog Post",
      excerpt: "Smoke test excerpt",
      body: "Body for automated test — safe to delete.",
      published: false,
    },
  });
  assert(blogCreate.status === 201, "Blog create", `status=${blogCreate.status}`);
  const blogId = blogCreate.json?.id;
  assert(!!blogId, "Blog id returned");

  const blogEdit = await req("/api/admin/blog", {
    method: "PATCH",
    jar,
    body: {
      id: blogId,
      title: "QA Test Blog Post (edited)",
      excerpt: "Edited excerpt",
      body: "Edited body",
      published: true,
    },
  });
  assert(blogEdit.status === 200 && blogEdit.json?.title?.includes("edited"), "Blog edit");

  const blogList = await req("/api/admin/blog", { jar });
  assert(
    blogList.status === 200 && Array.isArray(blogList.json) && blogList.json.some((p) => p.id === blogId),
    "Blog list includes created"
  );

  const blogDel = await req("/api/admin/blog", {
    method: "DELETE",
    jar,
    body: { id: blogId },
  });
  assert(blogDel.status === 200 && blogDel.json?.ok, "Blog delete");

  // --- Courses CRUD ---
  console.log("\n=== Courses CRUD ===");
  const courseCreate = await req("/api/admin/courses", {
    method: "POST",
    jar,
    body: {
      title: "QA Test Course",
      price: "Rs. 1,000",
      duration: "1 day",
      level: "Beginner",
      description: "Automated test course",
      published: false,
    },
  });
  assert(courseCreate.status === 201, "Course create", `status=${courseCreate.status}`);
  const courseId = courseCreate.json?.id;
  const courseEdit = await req("/api/admin/courses", {
    method: "PATCH",
    jar,
    body: {
      id: courseId,
      title: "QA Test Course (edited)",
      price: "Rs. 1,200",
      duration: "2 days",
      level: "Beginner",
      description: "Edited",
      published: true,
    },
  });
  assert(courseEdit.status === 200 && courseEdit.json?.title?.includes("edited"), "Course edit");
  const courseDel = await req("/api/admin/courses", {
    method: "DELETE",
    jar,
    body: { id: courseId },
  });
  assert(courseDel.status === 200 && courseDel.json?.ok, "Course delete");

  // --- Jobs CRUD ---
  console.log("\n=== Jobs CRUD ===");
  const jobCreate = await req("/api/admin/jobs", {
    method: "POST",
    jar,
    body: {
      title: "QA Test Job",
      location: "Jhelum",
      type: "Full-time",
      salaryText: "Negotiable",
      description: "Automated test job",
      active: false,
    },
  });
  assert(jobCreate.status === 201, "Job create", `status=${jobCreate.status} ${JSON.stringify(jobCreate.json)}`);
  const jobId = jobCreate.json?.id;
  const jobEdit = await req("/api/admin/jobs", {
    method: "PATCH",
    jar,
    body: {
      id: jobId,
      title: "QA Test Job (edited)",
      location: "Dina",
      type: "Part-time",
      salaryText: "PKR 20k",
      description: "Edited job",
      active: true,
    },
  });
  assert(jobEdit.status === 200 && jobEdit.json?.title?.includes("edited"), "Job edit", `status=${jobEdit.status}`);
  const jobDel = await req("/api/admin/jobs", {
    method: "DELETE",
    jar,
    body: { id: jobId },
  });
  assert(jobDel.status === 200 && jobDel.json?.ok, "Job delete");

  // --- Clients CRUD ---
  console.log("\n=== Clients CRUD ===");
  const clientCreate = await req("/api/admin/clients", {
    method: "POST",
    jar,
    body: {
      name: "QA Test Client",
      phone: "03001234567",
      area: "Jhelum",
      notes: "Automated test — delete me",
    },
  });
  assert(clientCreate.status === 201, "Client create", `status=${clientCreate.status}`);
  const clientId = clientCreate.json?.id;
  const clientEdit = await req("/api/admin/clients", {
    method: "PATCH",
    jar,
    body: {
      id: clientId,
      name: "QA Test Client (edited)",
      phone: "03007654321",
      area: "Gujrat",
      notes: "Edited",
    },
  });
  assert(clientEdit.status === 200 && clientEdit.json?.name?.includes("edited"), "Client edit");
  const clientDel = await req("/api/admin/clients", {
    method: "DELETE",
    jar,
    body: { id: clientId },
  });
  assert(clientDel.status === 200 && clientDel.json?.ok, "Client delete");

  // --- Blocked dates ---
  console.log("\n=== Blocked dates ===");
  const blockedGet = await req("/api/admin/blocked-dates", { jar });
  assert(blockedGet.status === 200, "Blocked dates GET");
  const previous = Array.isArray(blockedGet.json?.dates)
    ? blockedGet.json.dates
    : Array.isArray(blockedGet.json)
      ? blockedGet.json
      : [];
  const testDate = "2099-12-31";
  const withTest = [...new Set([...previous, testDate])];
  const blockedPut = await req("/api/admin/blocked-dates", {
    method: "PUT",
    jar,
    body: { dates: withTest },
  });
  assert(blockedPut.status === 200, "Blocked dates PUT add", `status=${blockedPut.status}`);
  const restore = await req("/api/admin/blocked-dates", {
    method: "PUT",
    jar,
    body: { dates: previous.filter((d) => d !== testDate) },
  });
  assert(restore.status === 200, "Blocked dates restore");

  // --- Content editors GET ---
  console.log("\n=== Content editors ===");
  const servicesGet = await req("/api/admin/content/services", { jar });
  assert(servicesGet.status === 200 && servicesGet.json?.makeup?.sections?.length >= 4, "Services content GET");
  const homeGet = await req("/api/admin/content/home", { jar });
  assert(homeGet.status === 200 && homeGet.json?.makeupSection, "Home content GET");
  const siteGet = await req("/api/admin/content/site", { jar });
  assert(siteGet.status === 200, "Site content GET", `status=${siteGet.status}`);

  // Soft edit: re-save makeup category as-is (edit path without changing live menu)
  if (servicesGet.json?.makeup) {
    const putCat = await req("/api/admin/content/services", {
      method: "PUT",
      jar,
      body: { category: "makeup", data: servicesGet.json.makeup },
    });
    assert(putCat.status === 200, "Services content PUT (makeup re-save)");
  }

  // --- Booking create + admin status edit + delete ---
  console.log("\n=== Bookings create / edit / delete ===");
  // Pick a weekday ~14 days out at 10:00
  const d = new Date();
  d.setDate(d.getDate() + 14);
  while (d.getDay() === 0) d.setDate(d.getDate() + 1);
  const date = d.toISOString().slice(0, 10);
  const bookingPost = await req("/api/bookings", {
    method: "POST",
    body: {
      name: "QA Test Guest",
      email: "qa-test@example.com",
      phone: "03001112222",
      service: "Party Makeup",
      date,
      time: "10:00",
      message: "Automated smoke test booking — delete me",
      area: "Jhelum",
      price: "Rs. 7,000",
    },
  });
  assert(
    bookingPost.status === 200 || bookingPost.status === 201,
    "Public booking create",
    `status=${bookingPost.status} ${JSON.stringify(bookingPost.json)}`
  );
  const bookingId = bookingPost.json?.id;

  if (bookingId) {
    const patch = await req("/api/admin/bookings", {
      method: "PATCH",
      jar,
      body: { id: bookingId, status: "confirmed" },
    });
    assert(
      patch.status === 200 && (patch.json?.status === "confirmed" || patch.json?.status),
      "Booking status edit",
      `status=${patch.status} body=${JSON.stringify(patch.json)}`
    );

    const del = await req("/api/admin/bookings", {
      method: "DELETE",
      jar,
      body: { id: bookingId },
    });
    assert(del.status === 200 && del.json?.ok, "Booking delete");
  }

  // Admin page HTML
  const adminPage = await req("/admin", { jar });
  assert(
    adminPage.status === 200 || adminPage.status === 307 || adminPage.status === 302,
    "GET /admin (authenticated)",
    `status=${adminPage.status}`
  );

  await req("/api/admin/logout", { method: "POST", jar });
  ok("Admin logout");
}

async function testMobilePlaywright() {
  console.log("\n=== Mobile viewport (Playwright) ===");
  let chromium;
  let devices;
  try {
    const require = createRequire(import.meta.url);
    ({ chromium, devices } = require("playwright"));
  } catch {
    console.log("Playwright not installed — installing chromium for one-shot mobile test...");
    const { execSync } = await import("child_process");
    try {
      execSync("npm install -D playwright@1.49.1 --no-save", {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      execSync("npx playwright install chromium", {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      const require = createRequire(import.meta.url);
      ({ chromium, devices } = require("playwright"));
    } catch (e) {
      fail("Playwright install", String(e.message || e));
      return;
    }
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...(devices?.["iPhone 13"] || {
      viewport: { width: 390, height: 844 },
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
      isMobile: true,
      hasTouch: true,
    }),
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("pageerror", (err) => consoleErrors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  const mobilePaths = [
    "/",
    "/services/makeup",
    "/services/facial",
    "/services/body-spa",
    "/services/mehndi",
    "/services/hair",
    "/services/nails",
    "/book",
    "/contact",
    "/blog",
    "/courses",
    "/jobs",
    "/admin/login",
  ];

  for (const path of mobilePaths) {
    const errorsBefore = consoleErrors.length;
    const response = await page.goto(`${BASE}${path}`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    const status = response?.status() ?? 0;
    assert(status === 200, `Mobile load ${path}`, `status=${status}`);

    // Horizontal overflow check
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        overflowX: doc.scrollWidth > doc.clientWidth + 2,
      };
    });
    assert(
      !overflow.overflowX,
      `Mobile no horizontal overflow ${path}`,
      `scroll=${overflow.scrollWidth} client=${overflow.clientWidth}`
    );

    const newErrors = consoleErrors.slice(errorsBefore).filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("net::ERR") &&
        !/hydration/i.test(e)
    );
    assert(newErrors.length === 0, `Mobile no page errors ${path}`, newErrors.join("; "));
  }

  // Admin UI login + open panels
  await page.goto(`${BASE}/admin/login`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.fill('input[name="username"], input[type="text"]', USER).catch(() => {});
  // Try common selectors
  const userInput = page.locator('input[name="username"], input#username, input[type="text"]').first();
  const passInput = page.locator('input[name="password"], input#password, input[type="password"]').first();
  await userInput.fill(USER);
  await passInput.fill(PASS);
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(2000);
  const afterLogin = page.url();
  assert(
    afterLogin.includes("/admin") && !afterLogin.includes("/login"),
    "Mobile admin UI login",
    `url=${afterLogin}`
  );

  // Click through sidebar labels if present (open mobile drawer first)
  const openMenu = page.getByRole("button", { name: /open menu/i });
  const labels = ["Blog", "Courses", "Jobs", "Clients", "Bookings", "Services"];
  for (const label of labels) {
    try {
      if (await openMenu.isVisible().catch(() => false)) {
        await openMenu.click();
        await page.waitForTimeout(400);
      }
      const btn = page.getByRole("button", { name: new RegExp(`^${label}$`, "i") }).first();
      await btn.waitFor({ state: "visible", timeout: 5000 });
      await btn.click({ timeout: 5000 });
      await page.waitForTimeout(600);
      // close drawer if still open
      const closeMenu = page.getByRole("button", { name: /close menu/i });
      if (await closeMenu.isVisible().catch(() => false)) {
        await closeMenu.click().catch(() => {});
      }
      ok(`Mobile admin nav ${label}`);
    } catch (e) {
      fail(`Mobile admin nav ${label}`, String(e.message || e));
    }
  }

  // UI Blog add → delete on mobile
  try {
    if (await openMenu.isVisible().catch(() => false)) {
      await openMenu.click();
      await page.waitForTimeout(400);
    }
    await page.getByRole("button", { name: /^Blog$/i }).click();
    await page.waitForTimeout(1000);
    assert((await page.getByText("Blog posts").count()) > 0, "Mobile Blog panel visible");

    await page.getByRole("button", { name: /add post/i }).click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor({ state: "visible", timeout: 8000 });
    await dialog.locator("input").first().fill("Mobile QA Blog");
    await dialog.locator('button[type="submit"]').click();
    await page.waitForTimeout(1500);
    assert(
      (await page.getByText("Mobile QA Blog").count()) > 0,
      "Mobile UI blog create visible"
    );

    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: /delete mobile qa blog/i }).click();
    await page.waitForTimeout(1200);
    assert(
      (await page.getByText("Mobile QA Blog").count()) === 0,
      "Mobile UI blog delete"
    );
  } catch (e) {
    fail("Mobile UI blog CRUD", String(e.message || e));
  }

  await browser.close();
}

async function main() {
  console.log(`Testing ${BASE}`);
  try {
    await fetch(BASE);
  } catch {
    console.error(`Server not reachable at ${BASE}`);
    process.exit(1);
  }

  await testPublicPages();
  await testAdminCrud();
  await testMobilePlaywright();

  const failed = results.filter((r) => !r.ok);
  const passed = results.filter((r) => r.ok);
  console.log(`\n========== SUMMARY ==========`);
  console.log(`Passed: ${passed.length}`);
  console.log(`Failed: ${failed.length}`);
  if (failed.length) {
    console.log("\nFailed checks:");
    for (const f of failed) console.log(` - ${f.name}: ${f.detail}`);
  }
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
