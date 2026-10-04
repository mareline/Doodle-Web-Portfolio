// Private review endpoint at /api/admin/notes, used by /admin.html. Requires the NOTES_ADMIN_KEY environment variable.
import { createAdminHandler } from "../../lib/guestbook.mjs";
import { getStore } from "../../lib/store.mjs";

const handler = createAdminHandler(getStore, process.env);

export default {
  fetch: (req) => handler(req),
};
