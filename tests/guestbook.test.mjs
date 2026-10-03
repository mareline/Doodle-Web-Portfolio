// Run with `npm test`. Exercises the guestbook against an in-memory stand-in for Netlify Blobs.
import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { createAdminHandler, createNotesHandler, LIMITS } from "../netlify/lib/guestbook.mjs";

function memoryStore() {
  const data = new Map();
  return {
    data,
    async get(key, { type } = {}) {
      if (!data.has(key)) return null;
      return type === "json" ? JSON.parse(data.get(key)) : data.get(key);
    },
    async set(key, value, { onlyIfNew } = {}) {
      await Promise.resolve(); // yield, so concurrent requests interleave like real network calls
      if (onlyIfNew && data.has(key)) return { modified: false };
      data.set(key, String(value));
      return { modified: true };
    },
    async setJSON(key, value) {
      return this.set(key, JSON.stringify(value));
    },
    async delete(key) {
      data.delete(key);
    },
    async list({ prefix }) {
      return { blobs: [...data.keys()].filter((key) => key.startsWith(prefix)).map((key) => ({ key })) };
    },
  };
}

const ADMIN_KEY = "test-admin-key-1234567890";
let store, notes, admin;

beforeEach(() => {
  store = memoryStore();
  notes = createNotesHandler(() => store, { NOTES_SALT: "salt" });
  admin = createAdminHandler(() => store, { NOTES_ADMIN_KEY: ADMIN_KEY });
});

let formCounter = 0;
const form = (overrides = {}) => ({
  name: "Ana",
  message: `Love the site! #${++formCounter}`,
  website: "",
  startedAt: Date.now() - 10_000,
  idempotencyKey: `form-key-${formCounter}-${Math.random().toString(36).slice(2)}`,
  ...overrides,
});
const post = (body, ip = "1.1.1.1") =>
  notes(new Request("http://x/api/notes", { method: "POST", body: JSON.stringify(body) }), { ip });
const pendingCount = () => [...store.data.keys()].filter((k) => k.startsWith("pending/")).length;
const adminCall = (method, body, key = ADMIN_KEY) =>
  admin(new Request("http://x/api/admin/notes", {
    method,
    headers: { authorization: `Bearer ${key}` },
    body: body ? JSON.stringify(body) : undefined,
  }));

test("a valid note is stored as pending and not shown publicly yet", async () => {
  assert.equal((await post(form())).status, 201);
  assert.equal(pendingCount(), 1);
  const res = await notes(new Request("http://x/api/notes"));
  assert.deepEqual((await res.json()).notes, []);
});

test("double-clicks and retries with the same form key create only one note", async () => {
  const body = form();
  const results = await Promise.all(Array.from({ length: 5 }, () => post(body)));
  assert.deepEqual(results.map((r) => r.status).sort(), [200, 200, 200, 200, 201]);
  assert.equal(pendingCount(), 1);
});

test("the same message from the same visitor is a duplicate even with a new form", async () => {
  await post(form({ message: "hello there" }));
  await post(form({ message: "Hello   there" }));
  assert.equal(pendingCount(), 1);
});

test("50 different visitors at the same moment all get through", async () => {
  const results = await Promise.all(Array.from({ length: 50 }, (_, i) => post(form(), `10.0.0.${i}`)));
  assert.ok(results.every((r) => r.status === 201));
  assert.equal(pendingCount(), 50);
});

test("one visitor is rate limited after the hourly limit", async () => {
  for (let i = 0; i < LIMITS.perVisitorPerHour; i++) assert.equal((await post(form())).status, 201);
  const blocked = await post(form());
  assert.equal(blocked.status, 429);
  assert.equal(pendingCount(), LIMITS.perVisitorPerHour);
});

test("bots are silently ignored (honeypot, too fast)", async () => {
  assert.equal((await post(form({ website: "http://spam" }))).status, 202);
  assert.equal((await post(form({ startedAt: Date.now() }))).status, 202);
  assert.equal(pendingCount(), 0);
});

test("bad input is rejected with a friendly message", async () => {
  assert.equal((await post(form({ message: "   " }))).status, 400);
  assert.equal((await post(form({ message: "x".repeat(LIMITS.messageMax + 1) }))).status, 400);
  assert.equal((await post(form({ message: "check out www.spam.com" }))).status, 400);
  assert.equal((await post(form({ idempotencyKey: "short" }))).status, 400);
  const huge = await notes(new Request("http://x/api/notes", { method: "POST", body: "x".repeat(5000) }), { ip: "2.2.2.2" });
  assert.equal(huge.status, 413);
  assert.equal(pendingCount(), 0);
});

test("the inbox stops accepting notes when it's full", async () => {
  for (let i = 0; i < LIMITS.pendingMax; i++) store.data.set(`pending/fake-${i}`, "{}");
  assert.equal((await post(form(), "3.3.3.3")).status, 503);
});

test("admin needs the right key", async () => {
  assert.equal((await adminCall("GET", null, "wrong-key")).status, 401);
  assert.equal((await adminCall("GET")).status, 200);
});

test("approving makes a note public; deleting removes it", async () => {
  await post(form({ name: "Sam", message: "hi from Miami" }));
  const { pending } = await (await adminCall("GET")).json();
  assert.equal(pending.length, 1);

  assert.equal((await adminCall("POST", { id: pending[0].id, action: "approve" })).status, 200);
  let shown = (await (await notes(new Request("http://x/api/notes"))).json()).notes;
  assert.equal(shown.length, 1);
  assert.equal(shown[0].message, "hi from Miami");
  assert.equal(shown[0].approvedAt, undefined, "only public fields are exposed");

  assert.equal((await adminCall("POST", { id: pending[0].id, action: "delete" })).status, 200);
  shown = (await (await notes(new Request("http://x/api/notes"))).json()).notes;
  assert.equal(shown.length, 0);
});

test("text is cleaned to plain, single-spaced text", async () => {
  await post(form({ name: "  <b>Jo</b>‮ ", message: "line one\n\n\tline two" }));
  const [key] = [...store.data.keys()].filter((k) => k.startsWith("pending/"));
  const note = JSON.parse(store.data.get(key));
  assert.equal(note.message, "line one line two");
  assert.equal(note.name, "<b>Jo</b>"); // stored as text; React escapes it when displayed
});

test("the sender gets their note back to show it right away", async () => {
  const res = await post(form({ name: "Lu", message: "hiii" }));
  const body = await res.json();
  assert.equal(body.status, "pending");
  assert.equal(body.note.message, "hiii");
});

test("with NOTES_AUTO_APPROVE, notes go up for everyone instantly", async () => {
  const instant = createNotesHandler(() => store, { NOTES_AUTO_APPROVE: "true" });
  const res = await instant(new Request("http://x/api/notes", { method: "POST", body: JSON.stringify(form({ message: "so cute!" })) }), { ip: "9.9.9.9" });
  assert.equal((await res.json()).status, "approved");
  const shown = (await (await instant(new Request("http://x/api/notes"))).json()).notes;
  assert.deepEqual(shown.map((n) => n.message), ["so cute!"]);
});
