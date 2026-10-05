// Projects shelf of the Portfolio section (your Substack essays are pulled in automatically, see scripts/sync-substack.mjs).
// Each project shows as a folder; clicking it opens a window.
// Fields: title, type, summary, tags (optional), href (optional, the code), caseStudy (optional, a page on this site),
// teaser (one line shown on the case studies shelf; needed when there's a caseStudy).
export const PROJECTS = [
  {
    title: "Hero Shooter Review Analysis",
    type: "Data · AI · 2026",
    summary:
      "What are Overwatch 2 and Marvel Rivals players complaining about? A Python pipeline where a local LLM tags Steam reviews by sentiment and theme, then checks its own work with validation, self-correction and blind accuracy audits.",
    tags: ["Python", "pandas", "LLMs (Ollama, Llama, Qwen, Gemma)", "prompt engineering", "model evaluation", "Steam Web API", "matplotlib"],
    href: "https://github.com/mareline/LLM-Analysis-with-Hero-Shooter-Feedbacks",
    caseStudy: "/projects/hero-shooter-llm.html",
    teaser: "How I made an LLM’s answers trustworthy enough to act on, and why I moved from paid GPT-4 to free local models.",
  },
  {
    title: "Hand-Drawn Portfolio",
    type: "Web · 3D · 2026",
    summary:
      "The site you’re on! A sketchbook-style portfolio featuring my own drawings, pencil notes that erase as you scroll, an interactive cat, and a moderated message board with rate limiting and spam protection.",
    tags: ["React", "Tailwind", "Vercel Functions"],
    href: "https://github.com/mareline/Doodle-Web-Portfolio",
    caseStudy: "/projects/hand-drawn-portfolio.html",
    teaser: "Designing for recruiters, visitors and me at once, plus a spam-free message board.",
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
