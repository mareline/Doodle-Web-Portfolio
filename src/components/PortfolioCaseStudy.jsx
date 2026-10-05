import { BuildParts, Bumps, Card, CaseStudyPage, Chapter, Contents, Resources, Roadmap, Steps, kicker, prose } from "./CaseStudyParts";
import InkLink from "./InkLink";
import Reveal from "./Reveal";

// Case study for this site itself, told as a story for product roles.
// Facts come from this repo: lib/guestbook.mjs, lib/store.mjs, scripts/, tests/, vercel.json and the README.
const REPO_URL = "https://github.com/mareline/Doodle-Web-Portfolio";

const BUILT_WITH = ["React 19", "Vite", "Tailwind CSS v4", "Three.js", "Vercel Functions", "Upstash Redis", "Node test runner"];

const USERS = [
  {
    who: "recruiters & hiring managers",
    need: "They want my experience, my projects and a way to reach me, fast.",
  },
  {
    who: "visitors & friends",
    need: "They’re here to poke around, click the doodles, and maybe leave me a note.",
  },
  {
    who: "me, the admin",
    need: "I need to approve notes in seconds and keep the site fresh without touching code every time I publish something.",
  },
];

const REQUIREMENTS = [
  {
    need: "It has to look like me",
    why: "A template would’ve been faster, but I wanted a portfolio with a couple of doodles!",
    how: "Every illustration is my own drawing, which took a couple of tries :)",
  },
  {
    need: "Make the website fast to load",
    why: "A slow first load loses a recruiter before they’ve read a word.",
    how: "Drawings are shrunk automatically before every build, and the build refuses any image that’s too big.",
  },
  {
    need: "Easy to scan",
    why: "Recruiters skim. The story has to work in a minute.",
    how: "Five sections in a fixed order: hello, about, work, portfolio, contact. On desktop, each one snaps into place.",
  },
  {
    need: "Works for everyone",
    why: "Animation is fun until it makes someone dizzy or gets in the way.",
    how: "Motion switches off for people who’ve asked their device for less of it, and every layout works on a phone.",
  },
  {
    need: "Safe to hear from everyone visiting",
    why: "An open form on the internet invites spam...",
    how: "Every note waits for my approval, and spam gets stopped before it ever reaches me.",
  },
  {
    need: "Low upkeep",
    why: "If updating the site is a chore, it goes stale.",
    how: "My Substack essays pull in on every build, and adding a project means editing one list.",
  },
];

const RECRUITER_VISIT = [
  {
    title: "Say hi",
    body: "My name writes itself onto the page, and the girl I drew talks back when you click her.",
  },
  {
    title: "Get to know me",
    body: "My photo, bio and education, plus a toolbox. Tap any tool and it tells you how I use it at work.",
  },
  {
    title: "See where I’ve worked",
    body: "A hand-drawn timeline, newest to oldest. Tap a role to open what I did and what I learned there.",
  },
  {
    title: "Open my projects",
    body: "Projects are folders and each one opens into a little window with a short summary, the code, and case studies like this one. My two newest Substack essays sit right next to them.",
  },
  {
    title: "Reach out",
    body: "Contact links, and a message board if you’d rather leave a note.",
  },
];

const NOTE_JOURNEY = [
  {
    title: "Write a note",
    body: "A name if you want one, and up to 280 characters.",
  },
  {
    title: "Send it",
    body: "The note folds into a paper airplane and flies off.",
  },
  {
    title: "See it right away",
    body: "Your note pops onto the board for you instantly, labeled “only you can see this until I approve it”.",
  },
  {
    title: "I review it",
    body: "New notes land in my private inbox, and I can either approve a note or delete it.",
  },
  {
    title: "It goes up for everyone",
    body: "Approved notes show on the board for every visitor within about a minute.",
  },
];

const BUILD = [
  {
    title: "Turning my drawings to be usable on the web",
    summary:
      "I drew every illustration by hand, then built a React site around them that feels like flipping through a sketchbook.",
    how: [
      "I drew the butterfly, the sitting girl, the ornate photo frame, the sparkles, spiral, flower and lily branch, and the handwritten notes.",
      "The full-size drawings live in an art folder. Before every build, a script converts them into small WebP images at about twice the size they’re shown, so they stay sharp on high-resolution screens. It only redoes files that changed.",
      "A second script checks every image before a build. It warns about anything over 400 KB and blocks anything over 1.5 MB.",
      "Doodles drift a little with your cursor, like layers of paper. That effect turns off on touch screens and for anyone who prefers reduced motion.",
      "I used Claude for the paper effects: the crumpling dividers, the paper grain, the wobbly borders and underlines, the washi tape and sticky notes, the folder icons and windows, the timeline, the paper airplane, and the pencil and magnifying-glass cursors. The drawings and the product decisions are mine.",
    ],
  },
  {
    title: "A spam-free message board",
    summary:
      "Anyone can leave me a note, but nothing goes public until I approve it, and spam gets filtered out before it reaches my inbox.",
    how: [
      "Approval queue: new notes are saved as pending. Only approved notes are shown to everyone.",
      "Limits: three notes per visitor per hour and ten per day. If 200 notes are already waiting for review, the board pauses new ones until I catch up.",
      "Privacy: visitors are recognized by a scrambled (hashed) version of their IP address with a secret added. Those records delete themselves after a day.",
      "Bot traps: a hidden field that only bots fill in, and a timer that catches forms sent in under 2.5 seconds. Bots get a fake “success” so they don’t keep trying, and nothing is saved.",
      "Clean input: no links allowed, and every note is cleaned down to plain text.",
      "No duplicates: each form gets a one-time key, so a double-click or a retry on a slow connection never posts twice. The same message from the same visitor counts as a duplicate too.",
      "Locked inbox: my admin page needs a secret key. Wrong guesses are slowed down on purpose, and the page is hidden from search engines.",
    ],
  },
  {
    title: "Secure and easy to update",
    summary: "Site stays safe and current without manual updates.",
    how: [
      "Security headers tell browsers to run only my own scripts, never to show the site inside someone else’s page, and always to use a secure connection.",
      "My latest Substack essays and their cover images are pulled in before every build. If Substack is down, the build keeps the posts it saved last time instead of failing.",
      "Projects, jobs and case studies are plain lists in the code, so updating them is a quick edit.",
      "Hosting is on Vercel, with the message board running as serverless functions and notes stored in Upstash Redis.",
    ],
  },
];

const BUMPS = [
  {
    title: "Moving from Netlify to Vercel, mid-build",
    problem:
      "The site started on Netlify, with notes stored in Netlify Blobs. Moving to Vercel required rewriting the server code and setting up a whole new database.",
    result: "It took some rework, but the message board works the same as it did before the move.",
  },
  {
    title: "Stopping spam",
    problem: "A public form attracts bots, and I didn’t want a CAPTCHA.",
    fix: "Invisible checks instead: the hidden field, the timer, per-visitor limits and the no-links rule. Bots get a fake success, so they move on.",
    result: "Real visitors never see a challenge.",
  },
  {
    title: "Approval workflow requires the user to wait",
    problem: "With moderation, a visitor sends a note and then sees nothing happen. They might think the message didn't work.",
    fix: "The server hands the note back right away, and it shows on the board only for the sender, with a label explaining it’s waiting for me.",
    result: "Instant feedback for the visitor.",
  },
  {
    title: "Big drawings, slow site",
    problem: "My original drawings add up to about 10 MB. The photo alone is 2.7 MB.",
    fix: "Automatic WebP conversion at the right size for the page, plus a build check that refuses oversized images.",
    result: "All the art together is now under 1 MB, more than 90% smaller, and it still looks hand-drawn.",
  },
];

// Docs and references the build relies on. Add or swap in anything else you read along the way.
const RESOURCES = [
  { label: "React documentation", href: "https://react.dev/learn" },
  { label: "Vite guide", href: "https://vite.dev/guide/" },
  { label: "Tailwind CSS documentation", href: "https://tailwindcss.com/docs" },
  { label: "Three.js documentation", href: "https://threejs.org/docs/" },
  { label: "Vercel Functions", href: "https://vercel.com/docs/functions" },
  { label: "Upstash Redis documentation", href: "https://upstash.com/docs/redis/overall/getstarted" },
  { label: "sharp: image processing for Node.js", href: "https://sharp.pixelplumbing.com/" },
  { label: "Node.js test runner", href: "https://nodejs.org/api/test.html" },
  { label: "MDN: Content Security Policy", href: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP" },
  { label: "MDN: prefers-reduced-motion", href: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion" },
];

// status: "done", "in progress" or "up next"
const ROADMAP = [
  { status: "done", title: "The sketchbook", body: "Hand-drawn site with my own art, live on Vercel." },
  { status: "done", title: "The message board", body: "Moderated notes with spam protection and automated tests." },
  { status: "done", title: "The move", body: "Netlify to Vercel, with notes now stored in Upstash Redis." },
  { status: "done", title: "This case study", body: "The full story of this site, the one you’re reading." },
];

// Chapter titles, in order: used for the headings and the table of contents
const CHAPTERS = [
  "The problem",
  "Who it’s for",
  "The requirements",
  "The workflows",
  "How I built it",
  "Bumps in the road",
  "Where it stands",
  "Why it matters for product",
];

export default function PortfolioCaseStudy() {
  return (
    <CaseStudyPage link={{ href: REPO_URL, label: "view the code on GitHub →" }}>
      {/* ---------- Intro ---------- */}
      <header className="mt-14">
        <p className={kicker}>Case study · Web · 2026</p>
        <h1 className="mt-3 font-display text-wide text-[clamp(1.9rem,5.5vw,3.6rem)] leading-[1.05] font-black uppercase">
          A portfolio that feels like a sketchbook
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed">
          The site you’re on right now!
        </p>

        <dl className="mt-8 grid gap-6 sm:grid-cols-3">
          <div>
            <dt className={kicker}>My role</dt>
            <dd className="mt-1 text-[15px]">Concept, art, product decisions and build</dd>
          </div>
          <div>
            <dt className={kicker}>Status</dt>
            <dd className="mt-1 text-[15px]">Live, and you’re looking at it</dd>
          </div>
          <div>
            <dt className={kicker}>Built with</dt>
            <dd className="mt-1 font-hand text-xl leading-snug">{BUILT_WITH.join(" · ")}</dd>
          </div>
        </dl>

        <Reveal className="bio-frame mt-12 px-6 pt-8 pb-6 sm:px-8" delay={100}>
          <p className="font-hand text-2xl leading-none">the short version</p>
          <ul className={`mt-3 space-y-2 ${prose}`}>
            <li>★ <strong>Problem statement:</strong> how do I make a portfolio people remember, without making recruiters work any harder to find what they came for?</li>
            <li>★ <strong>What I built:</strong> a hand-drawn React site with my own art, playful little interactions, and a moderated message board.</li>
            <li>★ <strong>Safety:</strong> every note waits for my approval, and spam never reaches me.</li>
          </ul>
        </Reveal>
        <Contents chapters={CHAPTERS} />
      </header>

      {/* ---------- 1. Problem ---------- */}
      <Chapter number={1} title={CHAPTERS[0]}>
        <div className={`max-w-2xl space-y-4 ${prose}`}>
          <p>
            Most portfolios look the same: a clean template, a headshot, a list of jobs. They work. Nobody remembers
            them.
          </p>
          <p>
            I wanted mine to feel like flipping through a sketchbook, with torn notebook paper, sticky notes and my own
            drawings. But a recruiter gives it a minute, maybe less. If the fun gets in the way
            of finding my experience, the site has failed, no matter how cute it is.
          </p>
        </div>
        <Reveal className="taped sketch-border relative mx-auto mt-10 max-w-xl -rotate-1 bg-card px-6 pt-8 pb-6 text-center shadow-[3px_4px_0_rgba(0,0,0,0.08)]">
          <p className={kicker}>Problem statement</p>
          <p className="mt-2 font-hand text-2xl leading-snug">
            How do I make a portfolio people remember, without making recruiters work any harder to find what they came
            for?
          </p>
        </Reveal>
      </Chapter>

      {/* ---------- 2. Users ---------- */}
      <Chapter number={2} title={CHAPTERS[1]}>
        <p className={`max-w-2xl ${prose}`}>Three kinds of people use this site, and each one wants something different.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {USERS.map((u, i) => (
            <Reveal key={u.who} delay={i * 80} className="h-full">
              <Card className="h-full">
                <p className="font-hand text-2xl leading-none">{u.who}</p>
                <p className="mt-2 text-[14.5px] leading-relaxed">{u.need}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Chapter>

      {/* ---------- 3. Requirements ---------- */}
      <Chapter number={3} title={CHAPTERS[2]}>
        <p className={`max-w-2xl ${prose}`}>
          Before building anything, I wrote down what “done” had to mean.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {REQUIREMENTS.map((r, i) => (
            <Reveal key={r.need} delay={i * 80} className="h-full">
              <Card className={`h-full ${i % 2 ? "rotate-[0.6deg]" : "-rotate-[0.6deg]"}`}>
                <p className="text-base leading-snug font-bold">{r.need}</p>
                <p className="mt-1 text-[14px] leading-relaxed opacity-80">{r.why}</p>
                <p className="mt-2 font-hand text-xl leading-snug">→ {r.how}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Chapter>

      {/* ---------- 4. Workflows ---------- */}
      <Chapter number={4} title={CHAPTERS[3]}>
        <p className={`max-w-2xl ${prose}`}>Here are the two journeys that matter most: a recruiter’s visit and a note on its way to the board!</p>

        <h3 className="mt-10 font-hand text-[1.9rem] leading-none">a recruiter’s visit</h3>
        <Steps steps={RECRUITER_VISIT} />

        <h3 className="mt-14 font-hand text-[1.9rem] leading-none">leaving a note</h3>
        <Steps steps={NOTE_JOURNEY} />
      </Chapter>

      {/* ---------- 5. How I built it ---------- */}
      <Chapter number={5} title={CHAPTERS[4]}>
        <p className={`max-w-2xl ${prose}`}>
          Three pieces below:
        </p>
        <BuildParts parts={BUILD} />
        <Resources links={RESOURCES} />
      </Chapter>

      {/* ---------- 6. Bumps ---------- */}
      <Chapter number={6} title={CHAPTERS[5]}>
        <p className={`max-w-2xl ${prose}`}>Not everything went to plan. Here’s what broke, and how I fixed it.</p>
        <Bumps bumps={BUMPS} />
      </Chapter>

      {/* ---------- 7. Roadmap ---------- */}
      <Chapter number={7} title={CHAPTERS[6]}>
        <Roadmap phases={ROADMAP} />
      </Chapter>

      {/* ---------- 8. Takeaways ---------- */}
      <Chapter number={8} title={CHAPTERS[7]}>
        <div className={`max-w-2xl space-y-4 ${prose}`}>
          <p>What I learned:</p>
          <ul className="space-y-2">
            <li>✦ My doodles and a skimmable site can live on the same page.</li>
            <li>✦ A public message board means planning for spam and privacy first.</li>
            <li>✦ One small storage interface made the Vercel move a rework, not a rebuild.</li>
            <li>✦ Image checks and the Substack sync run on every build, so I don’t have to.</li>
          </ul>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
          <InkLink href={REPO_URL} external className="font-hand text-3xl">view the code on GitHub →</InkLink>
          <InkLink href="/#contact" className="font-hand text-2xl">leave me a note ♡</InkLink>
        </div>
      </Chapter>
    </CaseStudyPage>
  );
}
