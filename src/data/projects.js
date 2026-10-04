// Projects shelf of the Portfolio section (your Substack essays are pulled in automatically, see scripts/sync-substack.mjs).
// Each project shows as a folder; clicking it opens a window. Fields: title, type, summary, tags (optional), href (optional).
// TODO: add a product case study or two here; they matter most for PM roles.
export const PROJECTS = [
  {
    title: "Hand-Drawn Portfolio",
    type: "Web · 3D · 2026",
    summary:
      "The site you’re on! A sketchbook-style portfolio featuring my own drawings, pencil notes that erase as you scroll, an interactive cat, and a moderated message board with rate limiting and spam protection.",
    tags: ["React", "Tailwind", "Vercel Functions"],
    // href: "https://github.com/mareline/<repo-name>", // TODO: add once the repo is on GitHub
  },
  {
    title: "3D Web Design Portfolio",
    type: "Web · 3D · 2023",
    summary: "A 3D web design portfolio that showcases my projects and skills using ThreeJS and ReactJS.",
    tags: [
      "React",
      "Three.js",
      "Tailwind"
    ],
    href: "https://github.com/mareline/Web-Portfolio"
  },
  {
    title: "Bookstore",
    type: "Backend",
    summary: "A classroom assignment that showcases a library using Java, Postman, Spring Boot, and MySQL.",
    tags: [
      "Java",
      "Spring Boot",
      "MySQL",
      "Postman"
    ],
    href: "https://github.com/mareline/Group-19"
  }
];
