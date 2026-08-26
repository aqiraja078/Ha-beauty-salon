#!/usr/bin/env node
/**
 * Site-wide QA crawl: pages, internal links, dynamic detail routes, key APIs.
 * Outputs JSON summary to stdout (last line) + human log.
 */
import { promises as fs } from "fs";
import path from "path";

const BASE = process.env.TEST_BASE || "http://localhost:3000";
const ROOT = process.cwd();

const findings = [];
const pageResults = [];

function add(severity, area, issue, detail = "") {
  findings.push({ severity, area, issue, detail });
  const tag = severity.toUpperCase().padEnd(8);
  console.log(`${tag} [${area}] ${issue}${detail ? ` — ${detail}` : ""}`);
}

async function fetchText(urlPath, opts = {}) {
  const url = urlPath.startsWith("http") ? urlPath : `${BASE}${urlPath}`;
  try {
    const res = await fetch(url, {
      redirect: "manual",
      headers: opts.headers || {},
      method: opts.method || "GET",
      body: opts.body,
    });
    const text = await res.text();
    return { status: res.status, text, headers: res.headers, url };
  } catch (e) {
    return {
      status: 0,
      text: "",
      headers: new Headers(),
      url,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

function extractLinks(html) {
  const hrefs = new Set();
  const re = /href=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    hrefs.add(m[1]);
  }
  return [...hrefs];
}

function normalizeInternal(href) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
    return null;
  }
  if (href.startsWith("http://") || href.startsWith("https://")) {
    try {
      const u = new URL(href);
      if (u.origin.replace(/\/$/, "") !== BASE.replace(/\/$/, "")) return null;
      return u.pathname + u.search;
    } catch {
      return null;
    }
  }
  if (href.startsWith("//")) return null;
  if (!href.startsWith("/")) return `/${href}`;
  return href.split("#")[0] || href;
}

async function loadJsonData(rel) {
  try {
    const raw = await fs.readFile(path.join(ROOT, rel), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function main() {
  console.log(`\n=== Site QA crawl @ ${BASE} ===\n`);

  const seedPaths = [
    "/",
    "/services/hair",
    "/services/makeup",
    "/services/facial",
    "/services/body-spa",
    "/services/nails",
    "/services/mehndi",
    "/book",
    "/contact",
    "/sales",
    "/how-to-book",
    "/blog",
    "/courses",
    "/jobs",
    "/admin/login",
    "/sitemap.xml",
    "/robots.txt",
  ];

  // Dynamic detail URLs from data
  const blogs = (await loadJsonData("data/blog.json")) || [];
  const courses = (await loadJsonData("data/courses.json")) || [];
  const jobs = (await loadJsonData("data/jobs.json")) || [];

  for (const b of blogs) {
    if (b.published !== false && b.slug) seedPaths.push(`/blog/${b.slug}`);
  }
  for (const c of courses) {
    if (c.published && c.slug) seedPaths.push(`/courses/${c.slug}`);
  }
  for (const j of jobs) {
    if (j.active !== false && j.slug) seedPaths.push(`/jobs/${j.slug}`);
  }

  // Crawl BFS for internal links (depth-limited)
  const visited = new Set();
  const queue = [...new Set(seedPaths)];
  const MAX = 80;

  while (queue.length && visited.size < MAX) {
    const p = queue.shift();
    if (!p || visited.has(p)) continue;
    // skip api + admin console (login only as public)
    if (p.startsWith("/api/")) continue;
    if (p.startsWith("/admin") && p !== "/admin/login") continue;
    visited.add(p);

    const { status, text, error } = await fetchText(p);
    pageResults.push({ path: p, status, error: error || null, bytes: text.length });

    if (error) {
      add("critical", "page", `Network error ${p}`, error);
      continue;
    }
    if (status >= 500) {
      add("critical", "page", `${status} on ${p}`);
      continue;
    }
    if (status === 404) {
      add("high", "page", `404 Not Found: ${p}`);
      continue;
    }
    if (status === 307 || status === 308 || status === 302 || status === 301) {
      // ok for some routes
      continue;
    }
    if (status !== 200) {
      add("medium", "page", `Unexpected status ${status}: ${p}`);
      continue;
    }

    if (/Something went wrong|Application error|Unhandled Runtime Error/i.test(text)) {
      add("critical", "page", `Error UI rendered on ${p}`);
    }
    if (text.length < 400 && p !== "/robots.txt" && !p.endsWith(".xml")) {
      add("medium", "page", `Suspiciously short HTML on ${p}`, `${text.length} bytes`);
    }

    // Collect links only from HTML pages
    if (p.endsWith(".xml") || p.endsWith(".txt")) continue;

    for (const href of extractLinks(text)) {
      if (!href || href === "#" || href.trim() === "") {
        add("low", "link", `Empty or hash-only href on ${p}`, href || "(empty)");
        continue;
      }
      const internal = normalizeInternal(href);
      if (!internal) continue;
      // skip next assets
      if (internal.startsWith("/_next/")) continue;
      if (!visited.has(internal) && !queue.includes(internal) && visited.size + queue.length < MAX) {
        queue.push(internal);
      }
    }
  }

  // Explicit broken-link check for all discovered internal paths
  console.log("\n=== Verifying crawled paths ===\n");
  for (const { path: p, status } of pageResults) {
    if (status === 200) continue;
    // already logged
  }

  // Nav labels expected
  console.log("\n=== Nav / content spot checks ===\n");
  const home = await fetchText("/");
  if (home.status === 200) {
    for (const label of ["Sales", "Courses", "Jobs", "Blog", "Book"]) {
      if (!home.text.includes(label)) {
        add("medium", "nav", `Home HTML missing nav label "${label}"`);
      }
    }
    if (home.text.includes(">Offers<") || home.text.includes('"Offers"')) {
      // Offers may still appear in CMS content; only flag nav if exact Offers link label
    }
  }

  const coursesPage = await fetchText("/courses");
  if (coursesPage.status === 200) {
    if (!coursesPage.text.includes("View") || !/apply/i.test(coursesPage.text)) {
      add("medium", "ui", "Courses page missing View & apply CTA text");
    }
  }

  const offers = await fetchText("/sales");
  if (offers.status === 200 && !/Sales|sales|offer/i.test(offers.text)) {
    add("low", "ui", "Sales page content unclear");
  }

  // Key public APIs (expect validation errors, not 500)
  console.log("\n=== Public API smoke ===\n");
  const apis = [
    {
      path: "/api/bookings",
      method: "POST",
      body: JSON.stringify({}),
      expectNot: [500],
    },
    {
      path: "/api/course-enrollments",
      method: "POST",
      body: JSON.stringify({}),
      expectNot: [500],
    },
    {
      path: "/api/job-applications",
      method: "POST",
      body: JSON.stringify({}),
      expectNot: [500],
    },
  ];
  for (const a of apis) {
    const r = await fetchText(a.path, {
      method: a.method,
      body: a.body,
      headers: { "Content-Type": "application/json" },
    });
    if (a.expectNot.includes(r.status) || r.status >= 500) {
      add("high", "api", `${a.method} ${a.path} returned ${r.status}`, r.text.slice(0, 120));
    } else if (r.status === 0) {
      add("critical", "api", `${a.path} network error`, r.error);
    } else {
      console.log(`OK       [api] ${a.method} ${a.path} → ${r.status}`);
    }
  }

  // Valid enrollment with known course
  const pubCourse = courses.find((c) => c.published && c.slug);
  if (pubCourse) {
    const r = await fetchText("/api/course-enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseSlug: pubCourse.slug,
        name: "QA Tester",
        phone: "03009998887",
        city: "Jhelum",
      }),
    });
    if (r.status !== 200) {
      add("high", "api", "Valid course enrollment failed", `status=${r.status} ${r.text.slice(0, 160)}`);
    } else {
      console.log(`OK       [api] course enrollment works`);
    }
  }

  // Admin login
  const login = await fetchText("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: process.env.ADMIN_USERNAME || "huma-admin",
      password: process.env.ADMIN_PASSWORD || "HumaAdmin@123!",
    }),
  });
  if (login.status !== 200) {
    add("critical", "admin", "Admin login failed", `status=${login.status}`);
  } else {
    console.log(`OK       [admin] login`);
  }

  // Image / asset 404s from home (sample)
  const imgRe = /(?:src|href)=["']([^"']+\.(?:png|jpe?g|webp|svg|gif))["']/gi;
  const imgs = new Set();
  let im;
  const sampleHtml = home.text;
  while ((im = imgRe.exec(sampleHtml))) {
    const src = normalizeInternal(im[1]);
    if (src) imgs.add(src);
  }
  let imgChecked = 0;
  for (const src of imgs) {
    if (imgChecked >= 25) break;
    imgChecked++;
    const r = await fetchText(src);
    if (r.status === 404) {
      add("medium", "asset", `Broken image/asset ${src}`);
    } else if (r.status >= 500) {
      add("high", "asset", `Asset error ${r.status} ${src}`);
    }
  }

  // Sitemap URLs
  const sm = await fetchText("/sitemap.xml");
  if (sm.status === 200) {
    const locs = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]);
    for (const loc of locs.slice(0, 40)) {
      try {
        const u = new URL(loc);
        const p = u.pathname;
        const r = await fetchText(p);
        if (r.status !== 200 && r.status !== 307 && r.status !== 308) {
          add("high", "sitemap", `Sitemap URL not OK: ${p}`, `status=${r.status}`);
        }
      } catch {
        add("medium", "sitemap", `Bad sitemap loc: ${loc}`);
      }
    }
  } else {
    add("low", "seo", `/sitemap.xml status ${sm.status}`);
  }

  // Summary
  const bySev = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const f of findings) bySev[f.severity] = (bySev[f.severity] || 0) + 1;

  const summary = {
    base: BASE,
    checkedAt: new Date().toISOString(),
    pagesChecked: pageResults.length,
    pagesOk: pageResults.filter((p) => p.status === 200).length,
    pagesFail: pageResults.filter((p) => p.status !== 200 && p.status !== 0).length,
    findings,
    bySev,
    pageResults: pageResults.map(({ path: p, status, bytes }) => ({
      path: p,
      status,
      bytes,
    })),
  };

  const outPath = path.join(ROOT, "data", "qa-audit-latest.json");
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(summary, null, 2));

  console.log("\n=== Summary ===");
  console.log(
    `Pages: ${summary.pagesOk}/${summary.pagesChecked} OK | Findings: critical=${bySev.critical} high=${bySev.high} medium=${bySev.medium} low=${bySev.low}`
  );
  console.log(`Wrote ${outPath}`);
  console.log("\n__QA_JSON__");
  console.log(JSON.stringify(summary));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
