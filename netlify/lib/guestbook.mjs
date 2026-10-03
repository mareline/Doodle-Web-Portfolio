// "Write a cute msg!" wall: visitors leave short notes; approved notes show on the Contact section for everyone.
// Notes wait for your approval unless NOTES_AUTO_APPROVE is set to "true" (then they go up instantly).
// Storage is Netlify Blobs. Handlers take a getStore() function so they can be tested with an in-memory store.
//
// Keys in the "guestbook" store:
//   pending/<id>       notes waiting for review
//   approved/<id>      approved notes
//   index/approved     one pre-built list of approved notes, so the public page reads a single blob
//   ratelimit/<ip>     recent submission times per (hashed) visitor
//   idem/<key>         one per submitted form, so retries and double-clicks don't create duplicates
//   dupe/<hash>        same visitor + same message = duplicate
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";

export const LIMITS = {
  nameMax: 40,
  messageMax: 280,
  bodyMaxBytes: 2048,
  perVisitorPerHour: 3,
  perVisitorPerDay: 10,
  pendingMax: 200, // inbox cap: stop accepting new notes when this many are waiting for review
  approvedShown: 100,
  minFillMs: 2500, // faster than this from opening the form to sending = almost certainly a bot
};

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });

const sha256 = (text) => createHash("sha256").update(text).digest("hex");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Plain text only: drop control/invisible characters, collapse whitespace, cap length
function clean(value, max) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f​-‏‪-‮⁦-⁩]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

const LINK_PATTERN = /(https?:\/\/|www\.|\.(com|net|org|io|xyz|ru|top|info|biz)\b)/i;
const ID_PATTERN = /^[\w-]{1,64}$/;

const publicNote = ({ id, name, message, createdAt }) => ({ id, name, message, createdAt });

async function readAll(store, prefix) {
  const { blobs } = await store.list({ prefix });
  const notes = await Promise.all(blobs.map(({ key }) => store.get(key, { type: "json" })));
  return notes.filter(Boolean).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function rebuildApprovedIndex(store) {
  const approved = await readAll(store, "approved/");
  await store.setJSON("index/approved", approved.slice(0, LIMITS.approvedShown).map(publicNote));
}

// ---------- public: GET approved notes, POST a new note ----------

export function createNotesHandler(getStore, env = {}) {
  return async (req, context = {}) => {
    try {
      const store = getStore();
      if (req.method === "GET") {
        const notes = (await store.get("index/approved", { type: "json" })) ?? [];
        // Browsers re-check every time; Netlify's CDN serves a cached copy for up to a minute
        return json(200, { notes }, {
          "cache-control": "public, max-age=0, must-revalidate",
          "netlify-cdn-cache-control": "public, s-maxage=60, stale-while-revalidate=300",
        });
      }
      if (req.method === "POST") return await submit(req, context, store, env);
      return json(405, { error: "Method not allowed." }, { allow: "GET, POST" });
    } catch (error) {
      console.error("[guestbook] request failed:", error);
      return json(500, { error: "Something went wrong on my end. Please try again later." });
    }
  };
}

async function submit(req, context, store, env) {
  if (Number(req.headers.get("content-length") ?? 0) > LIMITS.bodyMaxBytes) {
    return json(413, { error: "That note is a little too long." });
  }
  const raw = await req.text();
  if (raw.length > LIMITS.bodyMaxBytes) return json(413, { error: "That note is a little too long." });

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: "Invalid request." });
  }

  // Bot checks: hidden field filled in, or form sent impossibly fast. Pretend it worked and store nothing.
  const elapsed = Date.now() - Number(body.startedAt);
  if (body.website || !Number.isFinite(elapsed) || elapsed < LIMITS.minFillMs) return json(202, { ok: true });

  const name = clean(body.name, LIMITS.nameMax) || "a friend";
  const message = clean(body.message, LIMITS.messageMax + 1);
  if (!message) return json(400, { error: "Write a little something first!" });
  if (message.length > LIMITS.messageMax) return json(400, { error: `Keep it under ${LIMITS.messageMax} characters.` });
  if (LINK_PATTERN.test(`${name} ${message}`)) return json(400, { error: "No links please, just say hi!" });

  const formKey = String(body.idempotencyKey ?? "");
  if (!/^[\w-]{8,64}$/.test(formKey)) return json(400, { error: "Invalid request." });

  const visitor = sha256(`${env.NOTES_SALT ?? ""}:${context.ip ?? "unknown"}`).slice(0, 32);
  const now = Date.now();

  const rateKey = `ratelimit/${visitor}`;
  const recent = ((await store.get(rateKey, { type: "json" })) ?? []).filter((t) => now - t < DAY);
  if (recent.filter((t) => now - t < HOUR).length >= LIMITS.perVisitorPerHour || recent.length >= LIMITS.perVisitorPerDay) {
    return json(429, { error: "You’ve said hi a lot already. Try again a bit later!" }, { "retry-after": "3600" });
  }

  const { blobs: pending } = await store.list({ prefix: "pending/" });
  if (pending.length >= LIMITS.pendingMax) {
    return json(503, { error: "My inbox is full right now. Please try again in a few days!" });
  }

  // Claim the form key and the visitor+message pair atomically; if either already exists, it's a duplicate.
  const id = `${now.toString(36)}-${randomUUID().slice(0, 8)}`;
  const firstSend = await store.set(`idem/${formKey}`, id, { onlyIfNew: true });
  if (!firstSend.modified) return json(200, { ok: true, duplicate: true });
  const dupeKey = `dupe/${sha256(`${visitor}:${message.toLowerCase()}`)}`;
  const newMessage = await store.set(dupeKey, id, { onlyIfNew: true });
  if (!newMessage.modified) return json(200, { ok: true, duplicate: true });

  const note = { id, name, message, createdAt: new Date(now).toISOString() };
  const autoApprove = env.NOTES_AUTO_APPROVE === "true";
  try {
    if (autoApprove) {
      await store.setJSON(`approved/${id}`, { ...note, approvedAt: note.createdAt });
      await rebuildApprovedIndex(store);
    } else {
      await store.setJSON(`pending/${id}`, note);
    }
  } catch (error) {
    // Release the claims so the visitor's retry isn't mistaken for a duplicate
    await Promise.allSettled([store.delete(`idem/${formKey}`), store.delete(dupeKey)]);
    throw error;
  }
  await store.setJSON(rateKey, [...recent, now]);
  return json(201, { ok: true, note: publicNote(note), status: autoApprove ? "approved" : "pending" });
}

// ---------- admin: review, approve, delete ----------

function isAuthorized(req, adminKey) {
  const given = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  // Compare fixed-length hashes so the check takes the same time whatever was typed
  return timingSafeEqual(Buffer.from(sha256(given), "hex"), Buffer.from(sha256(adminKey), "hex"));
}

export function createAdminHandler(getStore, env = {}) {
  return async (req) => {
    const adminKey = env.NOTES_ADMIN_KEY ?? "";
    if (adminKey.length < 16) return json(503, { error: "NOTES_ADMIN_KEY isn’t set up yet (needs 16+ characters)." });
    if (!isAuthorized(req, adminKey)) {
      await sleep(600); // slows down anyone guessing keys
      return json(401, { error: "Wrong key." });
    }

    try {
      const store = getStore();
      if (req.method === "GET") {
        const [pending, approved] = await Promise.all([readAll(store, "pending/"), readAll(store, "approved/")]);
        return json(200, { pending, approved });
      }

      if (req.method === "POST") {
        const { id, action } = await req.json().catch(() => ({}));
        if (!ID_PATTERN.test(String(id))) return json(400, { error: "Invalid note id." });

        if (action === "approve") {
          const note = await store.get(`pending/${id}`, { type: "json" });
          if (!note) return json(404, { error: "That note isn’t waiting for review anymore." });
          await store.setJSON(`approved/${id}`, { ...note, approvedAt: new Date().toISOString() });
          await store.delete(`pending/${id}`);
        } else if (action === "delete") {
          await Promise.all([store.delete(`pending/${id}`), store.delete(`approved/${id}`)]);
        } else {
          return json(400, { error: "Unknown action." });
        }

        await rebuildApprovedIndex(store);
        return json(200, { ok: true });
      }

      return json(405, { error: "Method not allowed." }, { allow: "GET, POST" });
    } catch (error) {
      console.error("[guestbook-admin] request failed:", error);
      return json(500, { error: "Something went wrong. Check the function logs in Netlify." });
    }
  };
}
