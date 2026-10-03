// Pulls your latest public Substack posts into src/data/writing.json and saves their cover images locally.
// Runs before every build (so a redeploy picks up new posts) or on demand with `npm run sync-writing`.
// If Substack can't be reached, the build carries on with the posts saved last time.
import { access, mkdir, writeFile } from "node:fs/promises";

const PUBLICATION = "https://marelineramirez.substack.com";
const OUT_JSON = "src/data/writing.json";
const IMAGE_DIR = "public/images/writing";
const TIMEOUT_MS = 10_000;

const exists = (path) => access(path).then(() => true, () => false);

async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response;
}

// Substack cover URLs are wrapped in their image CDN; ask it for a small JPEG instead of the full-size original.
function smallCoverUrl(coverImage) {
  const original = decodeURIComponent(coverImage.replace(/^https:\/\/substackcdn\.com\/image\/fetch\/[^/]+\//, ""));
  return `https://substackcdn.com/image/fetch/w_640,c_limit,f_jpg,q_auto:good/${encodeURIComponent(original)}`;
}

async function saveCover(post) {
  if (!post.cover_image) return null;
  const file = `${post.slug}.jpg`;
  const path = `${IMAGE_DIR}/${file}`;
  if (!(await exists(path))) {
    try {
      const bytes = await (await get(smallCoverUrl(post.cover_image))).arrayBuffer();
      await writeFile(path, Buffer.from(bytes));
    } catch (error) {
      console.warn(`  couldn't download the cover for "${post.title}" (${error.message})`);
      return null;
    }
  }
  return `writing/${file}`;
}

async function main() {
  const posts = await (await get(`${PUBLICATION}/api/v1/archive?sort=new&limit=50`)).json();
  await mkdir(IMAGE_DIR, { recursive: true });

  const items = [];
  for (const post of posts) {
    if (post.audience && post.audience !== "everyone") continue; // skip paid-only posts
    items.push({
      title: post.title,
      summary: post.subtitle || "",
      date: post.post_date?.slice(0, 10) ?? "",
      href: post.canonical_url,
      image: await saveCover(post),
    });
  }

  await writeFile(OUT_JSON, `${JSON.stringify(items, null, 2)}\n`);
  console.log(`✓ Synced ${items.length} Substack posts`);
}

main().catch((error) => {
  console.warn(`⚠ Substack sync skipped (${error.message}). Using the posts saved last time.`);
});
