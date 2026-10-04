// Guestbook storage on Upstash Redis (add it from Vercel → Storage → Marketplace; it sets the env vars for you).
// Exposes the small get/set/list/delete interface the guestbook handlers expect, so tests can swap in a Map.
import { Redis } from "@upstash/redis";

const PREFIX = "guestbook:";
let redis;

export function getStore() {
  // Reads UPSTASH_REDIS_REST_URL/TOKEN, or KV_REST_API_URL/TOKEN as set by the Vercel integration
  redis ??= Redis.fromEnv({ automaticDeserialization: false });
  return {
    async get(key, { type } = {}) {
      const value = await redis.get(PREFIX + key);
      if (value == null) return null;
      return type === "json" ? JSON.parse(value) : value;
    },
    // onlyIfNew: write only if the key doesn't exist yet. expireMs: Redis deletes the key after that long.
    async set(key, value, { onlyIfNew, expireMs } = {}) {
      const options = { ...(onlyIfNew && { nx: true }), ...(expireMs && { px: expireMs }) };
      const result = await redis.set(PREFIX + key, String(value), options);
      return { modified: result === "OK" };
    },
    async setJSON(key, value, options) {
      return this.set(key, JSON.stringify(value), options);
    },
    async delete(key) {
      await redis.del(PREFIX + key);
    },
    async list({ prefix }) {
      const keys = [];
      let cursor = "0";
      do {
        const [next, batch] = await redis.scan(cursor, { match: `${PREFIX}${prefix}*`, count: 500 });
        keys.push(...batch);
        cursor = String(next);
      } while (cursor !== "0");
      return { blobs: keys.map((key) => ({ key: key.slice(PREFIX.length) })) };
    },
  };
}
