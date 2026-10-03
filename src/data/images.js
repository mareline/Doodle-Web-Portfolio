// Drop your own image files into public/images/ using these exact names.
// Anything missing is simply hidden on the live site (and flagged with a dashed box while you run `npm run dev`).
export const IMAGE_FILES = {
  paperTexture: "paper-texture.jpg", // page background (set in index.css)
  butterfly: "butterfly.png",
  paperStar: "paper-star.png", // crumpled newspaper star, left of PORTFOLIO
  stars: "stars.png", // three little stars, top right of the title
  figure: "figure.png", // sitting girl illustration
  photo: "photo.jpg", // your headshot
  frame: "frame.png", // ornate frame drawn over the headshot (transparent middle)
  sparkles: "sparkles.png", // two sparkles beside ABOUT ME
  spiral: "spiral.png",
  flower: "flower.png",
  lilies: "lilies.png", // lily branch along the bottom of About
  handwriting: "handwriting.png", // faint handwritten notes behind the lilies
};

export function imageUrl(name) {
  return `${import.meta.env.BASE_URL}images/${IMAGE_FILES[name]}`;
}
