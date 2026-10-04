# Mareline Ramirez · Product Management Portfolio

A hand-drawn, paper-and-ink portfolio for my product management job search. I wanted a portfolio that feels like flipping through my sketchbook rather than another template: torn notebook paper, washi tape, sticky notes, and my own drawings, built with the same care I put into shipping products.

**Live site:** _coming soon_ · **Writing:** [marelineramirez.substack.com](https://marelineramirez.substack.com) · **LinkedIn:** [linkedin.com/in/mareline](https://www.linkedin.com/in/mareline)

---

## What's inside

| Section | What it does |
| --- | --- |
| **Hero** | My name "writes itself" in, the rules draw themselves, and my doodles drift gently with your cursor like layers of paper. |
| **About me** | Who I am, what I bring, and a sticker-style toolbox of the skills I use. |
| **Work** | Two hand-drawn timelines: professional experience, and volunteer and community work. |
| **Portfolio** | Projects as sketched desktop folders that open into little windows, plus my two newest Substack essays as taped polaroids. |
| **Contact** | A "write a cute msg!" note that folds into a paper airplane when sent, and a message wall of notes from visitors. |

**Details I'm proud of**

- **Crumpling paper (Three.js):** between sections, a torn notebook strip with a handwritten note scrunches into a paper ball and rolls away as you scroll. Scroll back up and it uncrumples.
- **Hand-drawn cursors:** a pencil while you browse, and a magnifying glass while you "review" anything clickable.
- **Always up to date:** my latest essays are pulled from Substack on every build, so there's nothing to update by hand.
- **Accessible motion:** every animation turns off for visitors whose device asks for reduced motion.

## Product thinking behind it

- **Who it's for:** recruiters and hiring managers, who spend a minute or two on a portfolio. The most important things (role, experience, writing, contact) are reachable in one scroll, and the playful details never block the content.
- **Constraints:** my current role is under NDA, so it shows only titles and dates. Details stay on my resume.
- **Trade-offs:** Three.js is about 130 KB, so it loads only after the page is ready. The first load stays small, and without WebGL the page falls back to a simple "✂ cut here" line.
- **Trust and safety:** messages on the wall are reviewed before they're public, so nothing unexpected appears on a job-search site.

## Built with

React 19 · Vite · Tailwind CSS v4 · Three.js · Netlify (hosting, serverless functions, Blobs storage) · Node's built-in test runner

## Engineering notes

- **Performance:** my full-size drawings (~10 MB) are automatically converted to web-sized WebP copies (~0.9 MB total) by [`scripts/optimize-images.mjs`](scripts/optimize-images.mjs); code-splitting (Three.js in its own chunk, loaded when the browser is idle), lazy-loaded images, a build check that flags any image over 400 KB, and long-term caching for fingerprinted assets.
- **Security:** a strict Content Security Policy and security headers ([`public/_headers`](public/_headers)), no third-party scripts, and visitor IPs hashed before they're used for rate limiting.
- **Message wall API** ([`netlify/lib/guestbook.mjs`](netlify/lib/guestbook.mjs)):
  - per-visitor rate limits (3 an hour, 10 a day)
  - atomic duplicate and double-click protection
  - a honeypot and timing check against bots
  - input cleaning and size limits
  - a cap on the review queue
  - a private review page at `/admin.html`
- **Resilience:** each section has its own error boundary, requests time out with friendly messages, and every empty or failed state has a designed fallback.
- **Tests:** `npm test` covers the message wall, including 50 visitors posting at the same moment.

## Credits

**Artwork by Mareline Ramirez.** All illustrations in [`art/`](art/) are my own drawings:
- the butterfly, crumpled newspaper star, little stars and sitting girl
- my framed photo (the ornate frame is hand-drawn too)
- the sparkles, spiral, flower, lily branch and hanging lily stem
- the crumpled-paper background texture

Please don't reuse them without asking.

**Elements created with Claude (Anthropic's AI).** These are drawn in code, not my illustrations:
- the torn notebook-paper dividers that crumple into a ball (Three.js)
- the paper-grain background texture
- hand-drawn underlines and squiggles
- washi tape, sticky notes and sketchy borders
- the folder icons, project windows and timeline
- the paper airplane, the pencil icon, and the pencil and magnifying-glass cursors
- the click sparkles

The site's code was also developed with help from [Claude Code](https://claude.com/claude-code).

**Also:**
- **Fonts:** [Archivo](https://fonts.google.com/specimen/Archivo), [Orbitron](https://fonts.google.com/specimen/Orbitron), [Allura](https://fonts.google.com/specimen/Allura), [Caveat](https://fonts.google.com/specimen/Caveat) and [DM Sans](https://fonts.google.com/specimen/DM+Sans) from Google Fonts (SIL Open Font License).
- **Essay covers:** from my own Substack posts. Video game screenshots belong to their respective publishers.
- **Libraries:** [Three.js](https://threejs.org), [React](https://react.dev) and [Tailwind CSS](https://tailwindcss.com) (MIT License).

---

## Running it yourself

```bash
npm install        # first time only
npm run dev        # local preview; edits update live
npm run dev:full   # same, plus the Netlify functions (message wall)
npm test           # message wall tests
npm run build      # production build into dist/
```

### Editing content

| What | Where |
| --- | --- |
| Drawings | `art/` (full-size originals; web copies are made automatically, see `src/data/images.js` for names) |
| Email and links | `src/data/site.js` |
| Work and volunteering | `src/data/work.js` |
| Projects (folders) | `src/data/projects.js` |
| Substack essays | automatic on every build (`npm run sync-writing` to refresh now) |
| About me | `src/components/About.jsx` |

Each doodle is a `<Doodle name="..." />`. Add `float`, `sway`, `depth={10}` (cursor drift) or `onPop={onPop}` (click sparkles) to change how it moves. Dividers are `<PaperDivider label="..." />` in `src/App.jsx`.

### Deploying (Netlify)

1. Connect this repo in Netlify. Build settings come from [`netlify.toml`](netlify.toml).
2. Under **Site configuration → Environment variables**, add:
   - `NOTES_ADMIN_KEY`: a long random password (16+ characters) for `/admin.html`
   - `NOTES_SALT`: any random string
   - optionally `NOTES_AUTO_APPROVE=true` to skip review (not recommended)
3. Point a free uptime monitor (for example [UptimeRobot](https://uptimerobot.com)) at the live URL.

---

© Mareline Ramirez. Code may be used as a reference. Artwork and written content may not be reused without permission.
