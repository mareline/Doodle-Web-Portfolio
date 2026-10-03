// Public "say hi!" endpoint: GET approved notes, POST a new note for review.
import { getStore } from "@netlify/blobs";
import { createNotesHandler } from "../lib/guestbook.mjs";

export default createNotesHandler(() => getStore({ name: "guestbook", consistency: "strong" }), process.env);

export const config = { path: "/api/notes" };
