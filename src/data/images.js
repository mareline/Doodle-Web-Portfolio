// Your drawings. Put full-size originals in art/ (e.g. art/butterfly.png); `npm run dev` / `npm run build`
// turn them into small web copies in public/images/ automatically. Anything missing is simply hidden on the
// live site (and flagged with a dashed box while you run `npm run dev`).
export const IMAGE_FILES = {
  butterfly: "butterfly.webp",
  paperStar: "paper-star.webp", // crumpled newspaper star, left of PORTFOLIO
  stars: "stars.webp", // three little stars, top right of the title
  figure: "figure.webp", // sitting girl illustration
  photo: "photo.webp", // headshot, already drawn inside its ornate frame
  sparkles: "sparkles.webp", // two sparkles beside ABOUT ME
  spiral: "spiral.webp",
  lilies: "lilies.webp", // lily branch framing the message bulletin board
  liliesDrip: "liliesdrip.webp", // tall lily stem hanging beside Work
};
// The paper texture (art/paper-texture.jpg → paper-texture.webp) is used as the page background in src/index.css.

export function imageUrl(name) {
  return `${import.meta.env.BASE_URL}images/${IMAGE_FILES[name]}`;
}
