#!/usr/bin/env node
/**
 * Admin A–Z smoke test against running server.
 * Usage: node scripts/admin-smoke-test.mjs [baseUrl]
 */
const BASE = process.argv[2] || "http://127.0.0.1:3010";
const jar = new Map();

function getCookieHeader() {
  if (!jar.size) return undefined;
  return Array.from(jar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

function storeCookies(res) {
  const raw = res.headers.getSetCookie?.() || [];
  for (const c of raw) {
    const [pair] = c.split(";");
    const eq = pair.indexOf("=");
    if (eq > 0) jar.set(pair.slice(0, eq), pair.slice(eq + 1));
  }
  const single = res.headers.get("set-cookie");
  if (single && !raw.length) {
    const [pair] = single.split(";");
    const eq = pair.indexOf("=");
    if (eq > 0) jar.set(pair.slice(0, eq), pair.slice(eq + 1));
  }
}

async function req(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const cookie = getCookieHeader();
  if (cookie) headers.Cookie = cookie;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });
  storeCookies(res);
  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: res.status, data };
}

const results = [];
function pass(name) {
  results.push({ name, ok: true });
  console.log(`✓ ${name}`);
}
function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.log(`✗ ${name}: ${detail}`);
}

async function main() {
  console.log(`Admin smoke test → ${BASE}\n`);

  // 1. Unauthorized
  let r = await req("GET", "/api/bookings");
  if (r.status === 401) pass("Bookings API rejects unauthenticated");
  else fail("Bookings API rejects unauthenticated", `status ${r.status}`);

  r = await req("GET", "/api/admin/clients");
  if (r.status === 401) pass("Clients API rejects unauthenticated");
  else fail("Clients API rejects unauthenticated", `status ${r.status}`);

  // 2. Login
  r = await req("POST", "/api/admin/login", {
    username: "huma-admin",
    password: "HumaAdmin@123!",
  });
  if (r.status === 200 && r.data?.ok) pass("Admin login");
  else fail("Admin login", JSON.stringify(r));

  // 3. Bookings list
  r = await req("GET", "/api/bookings");
  if (r.status === 200 && Array.isArray(r.data)) pass("GET bookings");
  else fail("GET bookings", JSON.stringify(r));

  // 4. Clients CRUD
  r = await req("POST", "/api/admin/clients", {
    name: "Smoke Test Client",
    phone: "03301234567",
    email: "smoke@test.com",
    idCard: "12345-1234567-1",
    address: "Jhelum",
    notes: "auto test",
  });
  const clientId = r.data?.id;
  if (r.status === 201 && clientId) pass("POST client");
  else fail("POST client", JSON.stringify(r));

  r = await req("GET", "/api/admin/clients");
  if (r.status === 200 && Array.isArray(r.data) && r.data.some((c) => c.id === clientId))
    pass("GET clients includes new");
  else fail("GET clients includes new", JSON.stringify(r));

  r = await req("PATCH", "/api/admin/clients", {
    id: clientId,
    name: "Smoke Test Updated",
    phone: "03309998877",
    notes: "patched",
  });
  if (r.status === 200 && r.data?.name === "Smoke Test Updated") pass("PATCH client");
  else fail("PATCH client", JSON.stringify(r));

  // 5. Blocked dates
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 30);
  const blockDate = tomorrow.toISOString().slice(0, 10);

  r = await req("GET", "/api/admin/blocked-dates");
  if (r.status === 200 && Array.isArray(r.data?.dates)) pass("GET blocked dates");
  else fail("GET blocked dates", JSON.stringify(r));

  r = await req("PUT", "/api/admin/blocked-dates", { dates: [blockDate] });
  if (r.status === 200 && r.data?.dates?.includes(blockDate)) pass("PUT blocked dates");
  else fail("PUT blocked dates", JSON.stringify(r));

  r = await req("GET", `/api/bookings/availability?date=${blockDate}`);
  if (r.status === 200 && r.data?.blocked === true) pass("Availability marks blocked date");
  else fail("Availability marks blocked date", JSON.stringify(r));

  // 6. Public booking on blocked date rejected
  r = await req("POST", "/api/bookings", {
    name: "Blocked Test",
    email: "blocked@test.com",
    phone: "03301234567",
    service: "Hair cut",
    date: blockDate,
    time: "10:00",
    area: "jhelum",
    bookingMode: "single",
    services: ["Hair cut"],
  });
  if (r.status === 400) pass("POST booking rejects blocked date");
  else fail("POST booking rejects blocked date", JSON.stringify(r));

  // Unblock
  await req("PUT", "/api/admin/blocked-dates", { dates: [] });

  // 7. Create booking
  const bookDate = new Date();
  bookDate.setDate(bookDate.getDate() + 14);
  const apptDate = bookDate.toISOString().slice(0, 10);

  r = await req("POST", "/api/bookings", {
    name: "Smoke Booking",
    email: "booking@test.com",
    phone: "03301234567",
    service: "Hair cut",
    date: apptDate,
    time: "11:00",
    area: "jhelum",
    bookingMode: "single",
    services: ["Hair cut"],
    price: "500",
  });
  const bookingId = r.data?.id;
  if (r.status === 200 && bookingId) pass("POST public booking");
  else fail("POST public booking", JSON.stringify(r));

  // Refresh bookings
  r = await req("GET", "/api/bookings");
  const booking = r.data?.find((b) => b.id === bookingId);
  if (booking) pass("Booking appears in admin list");
  else fail("Booking appears in admin list", "not found");

  // 8. Patch booking statuses + deposit
  for (const status of ["confirmed", "completed"]) {
    r = await req("PATCH", "/api/admin/bookings", { id: bookingId, status });
    if (r.status === 200 && r.data?.status === status)
      pass(`PATCH booking → ${status}`);
    else fail(`PATCH booking → ${status}`, JSON.stringify(r));
  }

  r = await req("PATCH", "/api/admin/bookings", {
    id: bookingId,
    depositPaid: 200,
    depositNote: "cash",
  });
  if (r.status === 200 && r.data?.depositPaid === 200) pass("PATCH booking deposit");
  else fail("PATCH booking deposit", JSON.stringify(r));

  r = await req("PATCH", "/api/admin/bookings", { id: bookingId, status: "no_show" });
  if (r.status === 200 && r.data?.status === "no_show") pass("PATCH booking → no_show");
  else fail("PATCH booking → no_show", JSON.stringify(r));

  // 9. Delete booking
  r = await req("DELETE", "/api/admin/bookings", { id: bookingId });
  if (r.status === 200) pass("DELETE booking");
  else fail("DELETE booking", JSON.stringify(r));

  // 10. Delete client
  r = await req("DELETE", "/api/admin/clients", { id: clientId });
  if (r.status === 200) pass("DELETE client");
  else fail("DELETE client", JSON.stringify(r));

  // 11. Logout
  r = await req("POST", "/api/admin/logout");
  if (r.status === 200) pass("Logout");
  else fail("Logout", JSON.stringify(r));

  r = await req("GET", "/api/bookings");
  if (r.status === 401) pass("Session cleared after logout");
  else fail("Session cleared after logout", `status ${r.status}`);

  // 12. Admin page loads
  r = await req("GET", "/admin/login");
  // fetch for HTML - need different approach
  const pageRes = await fetch(`${BASE}/admin/login`);
  if (pageRes.status === 200) pass("Admin login page loads");
  else fail("Admin login page loads", `status ${pageRes.status}`);

  const failed = results.filter((x) => !x.ok);
  console.log(`\n--- ${results.length - failed.length}/${results.length} passed ---`);
  if (failed.length) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
