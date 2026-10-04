// Public "say hi!" endpoint at /api/notes: GET approved notes, POST a new note for review.
import { createNotesHandler } from "../lib/guestbook.mjs";
import { getStore } from "../lib/store.mjs";

const handler = createNotesHandler(getStore, process.env);

// Vercel puts the visitor's IP in x-real-ip (and first in x-forwarded-for)
const visitorIp = (req) =>
  req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

export default {
  fetch: (req) => handler(req, { ip: visitorIp(req) }),
};
