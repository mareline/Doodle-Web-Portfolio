
export const IMAGE_FILES = {
  butterfly: "butterfly.webp",
  paperStar: "paper-star.webp", 
  stars: "stars.webp", 
  figure: "figure.webp",
  photo: "photo.webp", 
  sparkles: "sparkles.webp", 
  spiral: "spiral.webp",
  lilies: "lilies.webp", 
  liliesDrip: "liliesdrip.webp", 
};
// The paper texture (art/paper-texture.jpg → paper-texture.webp) is used as the page background in src/index.css.

export function imageUrl(name) {
  return `${import.meta.env.BASE_URL}images/${IMAGE_FILES[name]}`;
}
