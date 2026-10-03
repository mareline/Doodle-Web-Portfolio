// Runs automatically before `npm run build`.
// Big images are the #1 thing that makes portfolio sites slow, so this blocks anything huge and warns on anything heavy.
import { readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const IMAGES_DIR = "public/images";
const WARN_KB = 400;
const MAX_KB = 1500;

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

if (!existsSync(IMAGES_DIR)) process.exit(0);

let tooBig = 0;
for (const file of walk(IMAGES_DIR)) {
  if (!/\.(png|jpe?g|webp|gif|avif|svg)$/i.test(file)) continue;
  const kb = Math.round(statSync(file).size / 1024);
  const name = relative(IMAGES_DIR, file);
  if (kb > MAX_KB) {
    console.error(`✖ ${name} is ${kb} KB (limit ${MAX_KB} KB). Compress it at https://squoosh.app first.`);
    tooBig++;
  } else if (kb > WARN_KB) {
    console.warn(`⚠ ${name} is ${kb} KB. Consider compressing it (aim for under ${WARN_KB} KB).`);
  }
}

if (tooBig) process.exit(1);
