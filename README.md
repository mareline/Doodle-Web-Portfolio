# Mareline Ramirez — Product Management Portfolio

React + Vite + Tailwind. Static site: no server, no database, no forms.

## Run it

```bash
npm install      # first time only
npm run dev      # open the link it prints; edits update live
npm run build    # production build into dist/
```

## Edit content

| What                         | Where                       |
| ---------------------------- | --------------------------- |
| Images / doodles             | `public/images/` (see the README inside for file names) |
| Email + LinkedIn/Substack    | `src/data/site.js`          |
| Work experience              | `src/data/work.js`          |
| Projects (desktop folders)   | `src/data/projects.js`      |
| Substack essays (2 newest)   | automatic: pulled in on every build (`npm run sync-writing` to refresh now) |
| About me text                | `src/components/About.jsx`  |

Anything left empty is hidden, or shows a friendly "coming soon" note.

## Motion knobs

Every doodle is a `<Doodle name="..." />`. Add any of these to change how it moves:

- `float`: gentle bob up and down
- `boil`: outline jitters like a hand-drawn animation (best on small doodles)
- `sway`: rocks like a plant in the breeze
- `depth={10}`: drifts with the cursor; bigger = more, negative = opposite way
- `onPop={onPop}`: sparkle burst on click

Between sections, `<PaperDivider label="..." />` in `src/App.jsx` places a torn paper strip that crumples into a ball and rolls away as you scroll (Three.js, in `src/three/paperDividers.js`). Change the label text there, or add/remove dividers.
All motion switches off for visitors whose device is set to "reduce motion".

## Message wall ("write a cute msg!")

Visitors leave short notes in the Contact section. Notes wait for you to approve them, then show on the wall for everyone.

- **Review notes:** open `/admin.html` on your live site and enter your admin key.
- **Set up once** in Netlify → Site configuration → Environment variables:
  - `NOTES_ADMIN_KEY`: a long random password, 16+ characters (let a password manager generate it).
  - `NOTES_SALT`: any random string.
  - Optional: `NOTES_AUTO_APPROVE` = `true` publishes notes instantly with no review (not recommended for a job-search site).
- **Built-in protection:** 3 notes per visitor per hour (10 per day), duplicate and double-click blocking, a hidden bot trap, no links allowed, a 280-character limit, and the inbox stops accepting notes once 200 are waiting.
- **Running locally:** `npm run dev` shows the site, but the wall can only save on Netlify. Use `npm run dev:full` to run the Netlify functions too.
- **Tests:** `npm test` checks the wall's rules, including 50 visitors posting at once.

## Deploy

Recommended: **Netlify** or **Cloudflare Pages** (free). Connect this GitHub repo, set build command `npm run build` and output folder `dist`. They gzip/brotli-compress files, serve over HTTPS from a CDN, and apply `public/_headers` automatically.

## Launch checklist

- [ ] All images added and under ~400 KB each
- [ ] `src/data/site.js` filled in
- [ ] Free uptime monitor at https://uptimerobot.com pointed at your live URL (emails you if the site goes down)
- [ ] Open the live site on your phone and click every nav link
