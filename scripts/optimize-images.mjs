// Turns the full-size drawings in art/ into small, web-ready copies in public/images/.
// Runs automatically before `npm run dev` and `npm run build`; only redoes files that changed.
//   drawings (.png)  → .webp, transparent background kept, resized to the width below
//   paper-texture    → .webp (lower quality is invisible on a background), resized for the page width
import { mkdir, readdir, stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const SOURCE_DIR = "art";
const OUT_DIR = "public/images";
const DEFAULT_WIDTH = 600; // ~2× the largest size a doodle is shown at, so it stays crisp on retina screens

// Wider pieces need more pixels
const WIDTHS = {
  lilies: 1400,
  photo: 720,
  "paper-texture": 1920,
};

const newerThan = async (a, b) => {
  try {
    return (await stat(a)).mtimeMs > (await stat(b)).mtimeMs;
  } catch {
    return true; // output missing
  }
};

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const files = (await readdir(SOURCE_DIR)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

  for (const file of files) {
    const name = basename(file, extname(file));
    const isTexture = name === "paper-texture";
    const out = join(OUT_DIR, `${name}.webp`);
    const src = join(SOURCE_DIR, file);
    if (!(await newerThan(src, out))) continue;

    const image = sharp(src).rotate().resize({ width: WIDTHS[name] ?? DEFAULT_WIDTH, withoutEnlargement: true });
    await (isTexture ? image.webp({ quality: 55 }) : image.webp({ quality: 82, alphaQuality: 90 })).toFile(out);

    const before = Math.round((await stat(src)).size / 1024);
    const after = Math.round((await stat(out)).size / 1024);
    console.log(`  ${file} → ${basename(out)} (${before} KB → ${after} KB)`);
  }

  // Small PNG of the butterfly for the browser tab icon (works in every browser)
  const icon = join(OUT_DIR, "favicon.png");
  const butterfly = join(SOURCE_DIR, "butterfly.png");
  if (files.includes("butterfly.png") && (await newerThan(butterfly, icon))) {
    await sharp(butterfly).resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(icon);
  }
}

main().catch((error) => {
  console.error("✖ Image optimisation failed:", error.message);
  process.exit(1);
});
