// Private review endpoint used by /admin.html. Requires the NOTES_ADMIN_KEY environment variable.
import { getStore } from "@netlify/blobs";
import { createAdminHandler } from "../lib/guestbook.mjs";

export default createAdminHandler(() => getStore({ name: "guestbook", consistency: "strong" }), process.env);

export const config = { path: "/api/admin/notes" };
