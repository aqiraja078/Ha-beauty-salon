#!/usr/bin/env node
/**
 * Push local CMS JSON (home + services [+ site]) to a deployed admin API
 * so Netlify Blobs match the local menus/prices.
 *
 * Usage:
 *   ADMIN_USERNAME=... ADMIN_PASSWORD=... node scripts/sync-cms-to-live.mjs
 *   LIVE_BASE=https://habeautysalon.netlify.app node scripts/sync-cms-to-live.mjs
 */
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE = (process.env.LIVE_BASE || "https://habeautysalon.netlify.app").replace(
  /\/$/,
  ""
);
const USER = process.env.ADMIN_USERNAME || "huma-admin";
const PASS = process.env.ADMIN_PASSWORD || "HumaAdmin@123!";

function loadJson(rel) {
  return JSON.parse(readFileSync(path.join(ROOT, rel), "utf8"));
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

async function req(pathname, { method = "GET", body, jar } = {}) {
  const headers = {};
  if (jar?.size) headers.Cookie = cookieHeader(jar);
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(`${BASE}${pathname}`, {
    method,
    headers,
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
  return { status: res.status, json, text };
}

async function main() {
  console.log(`Syncing local CMS → ${BASE}`);
  const jar = new Map();

  const login = await req("/api/admin/login", {
    method: "POST",
    jar,
    body: { username: USER, password: PASS },
  });
  if (login.status !== 200) {
    console.error("Login failed:", login.status, login.text.slice(0, 200));
    process.exit(1);
  }
  console.log("Logged in");

  const home = loadJson("data/cms-home.json");
  const services = loadJson("data/cms-services.json");
  let site = null;
  try {
    site = loadJson("data/cms-site.json");
  } catch {
    /* optional */
  }

  const homeRes = await req("/api/admin/content/home", {
    method: "PUT",
    jar,
    body: home,
  });
  console.log(
    "PUT home:",
    homeRes.status,
    homeRes.status === 200
      ? `floors=${home.servicesSection?.categories?.map((c) => c.price).join(" | ")}`
      : homeRes.text.slice(0, 200)
  );
  if (homeRes.status !== 200) process.exit(1);

  const svcRes = await req("/api/admin/content/services", {
    method: "PUT",
    jar,
    body: services,
  });
  console.log(
    "PUT services:",
    svcRes.status,
    svcRes.status === 200
      ? `makeup=${services.makeup?.sections?.map((s) => s.title).join(", ")}`
      : svcRes.text.slice(0, 200)
  );
  if (svcRes.status !== 200) process.exit(1);

  if (site) {
    const siteRes = await req("/api/admin/content/site", {
      method: "PUT",
      jar,
      body: site,
    });
    console.log(
      "PUT site:",
      siteRes.status,
      siteRes.status === 200 ? "ok" : siteRes.text.slice(0, 200)
    );
    if (siteRes.status !== 200) process.exit(1);
  }

  console.log("Done. Verifying public pages…");
  const facial = await (await fetch(`${BASE}/services/facial`)).text();
  const homeHtml = await (await fetch(`${BASE}/`)).text();
  const checks = [
    ["home Facial From PKR 1,800", homeHtml.includes("From PKR 1,800")],
    ["home Wax From PKR 200", homeHtml.includes("From PKR 200")],
    ["home Makeup From PKR 3,500", homeHtml.includes("From PKR 3,500")],
    ["facial Basic Rs. 1,800", facial.includes("Rs. 1,800")],
    ["facial Jason Facial", facial.includes("Jason Facial")],
  ];
  for (const [label, ok] of checks) {
    console.log(`${ok ? "OK" : "MISS"}  ${label}`);
  }
  if (checks.some(([, ok]) => !ok)) {
    console.warn(
      "Some checks missed — CDN/cache may lag a minute; hard-refresh the site."
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
