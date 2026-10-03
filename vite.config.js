import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Vite minifies JS/CSS and fingerprints file names so hosts can cache them forever.
    assetsInlineLimit: 4096,
    // Three.js (the paper dividers) is a separate chunk that only loads after the page is ready.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      // The site, plus the private notes inbox at /admin.html
      input: { main: "index.html", admin: "admin.html" },
    },
  },
});
