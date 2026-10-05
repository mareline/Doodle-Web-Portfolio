import { BuildParts, Bumps, Card, CaseStudyPage, Chapter, Contents, Resources, Roadmap, Steps, kicker, prose } from "./CaseStudyParts";
import InkLink from "./InkLink";
import Reveal from "./Reveal";

// Case study for the "Hero Shooter Feedback" LLM project, told as a story for product roles.
// Facts here come from the project repo (review_compare.py, compare_models.py, score_audit.py).
// TODO: once a full run produces output_compare/theme_comparison.png, add it to public/images/ and show it under the intro.
const REPO_URL = "https://github.com/mareline/LLM-Analysis-with-Hero-Shooter-Feedbacks";

const SKILLS = ["Python", "pandas", "LLMs (Ollama, Llama, Qwen, Gemma)", "prompt engineering", "model evaluation", "Steam Web API", "matplotlib"];

const THEMES = [
  ["matchmaking & ranked", "match quality, ranked mode, skill balance between players"],
  ["hero balance", "power level, nerfs and buffs, the meta, counters"],
  ["performance & technical", "bugs, crashes, FPS, servers, lag"],
  ["monetization", "prices, skins, battle pass, value for money"],
  ["content variety", "number of heroes, maps and modes, pace of new content"],
  ["toxicity & cheating", "toxic players, harassment, cheaters"],
  ["core gameplay", "how it feels to play: gunplay, abilities, teamwork"],
  ["developer trust", "studio decisions, communication, broken promises"],
  ["other", "anything that fits none of the above"],
];

const REQUIREMENTS = [
  {
    need: "Good labels and results",
    why: "A wrong label that looks right is worse than no label at all.",
    how: "Anything that can’t be fixed is recorded as a failure, and the results are cross-checked.",
  },
  {
    need: "A fair comparison",
    why: "Two games are only comparable if both are measured with the same standards.",
    how: "One fixed list of nine themes and one prompt for both games.",
  },
  {
    need: "Free to run!",
    why: "Learning needs room to experiment, and paying for every run made each one a cost decision.",
    how: "Open-source models running locally through Ollama.",
  },

  {
    need: "Data honesty",
    why: "Stakeholders need to know how far they can trust the numbers.",
    how: "Accuracy checks and a 95% confidence range on every model score. Hand-labeling for the accuracy check is in progress.",
  },
];

const WORKFLOW = [
  {
    title: "Review the two games and ask questions",
    body: "Pick the games to compare and how many recent reviews to pull.",
  },
  {
    title: "Review the data from Steam and see what the players are saying",
    body: "The pipeline pulls recent English reviews from the Steam Web API for each game, with each reviewer’s thumbs up/down and playtime. Duplicates are dropped, and reviews under 40 characters (“10/10”) are skipped because they’re too short to have a theme.",
  },
  {
    title: "Let the model read every review",
    body: "A local LLM labels each review with an overall sentiment (positive, negative or mixed) and one to three themes, chosen only from the fixed list.",
    detail: '{ "sentiment": "negative", "themes": ["matchmaking_ranked", "hero_balance"] }',
    detailLabel: "the shape of every answer",
  },
  {
    title: "Review every answer and accept only allowed labels",
    body: "Each answer must be well-formed. If it isn’t, it goes back to the model with the exact error so it can correct itself. After three tries, the review is recorded as a failure instead of being guessed.",
  },
  {
    title: "Stop if the data isn’t good enough",
    body: "If more than 5% of reviews couldn’t be labeled, the run is flagged “do not report”.",
  },
  {
    title: "Measure the model’s accuracy",
    body: "A blind sample of 25 reviews per game is labeled by hand, then scored against the model.",
  },
  {
    title: "Read the comparison",
    body: "For each theme and game: what share of reviews raise it, and how negative those reviews are. A side-by-side chart shows which complaints are shared across the genre and which belong to one game.",
  },
  {
    title: "Use it for product decisions",
    body: "I’ll see which themes cost the most goodwill, check whether a competitor has the same problem, and take that straight into roadmap priorities.",
  },
];

// The three resume bullets, each with a plain-language summary and the technical "how" behind it
const BUILD = [
  {
    title: "A pipeline from Steam to labeled data",
    summary:
      "A Python pipeline pulls Steam reviews and has a locally hosted LLM (Llama 3.1 via Ollama) classify each review’s sentiment and themes against a fixed 9-theme taxonomy.",
    how: [
      "Reviews come from Steam’s public appreviews endpoint: recent, English, 100 per page, following Steam’s cursor from page to page until there are enough.",
      "Each review is sent to Ollama’s local chat API with a system prompt that defines the job and lists the nine themes, each with a one-line description so the model knows where the boundaries are.",
      "The model is asked for JSON only (Ollama’s JSON mode) at temperature 0, so the same review gets the same answer every time. Reviews over 2,000 characters get trimmed to that length.",
      "Four reviews are labeled in parallel to keep runs quick on a single GPU.",
      "pandas turns the labels into per-theme numbers for each game, and matplotlib draws the side-by-side theme chart. Every run also saves the raw labels and a summary file so the results can be traced back.",
    ],
  },
  {
    title: "Safeguards against unreliable LLM output",
    summary:
      "Schema validation, a self-correction loop that returns errors to the model, and a failure-rate threshold that blocks reporting.",
    how: [
      "Schema validation: an answer only counts if it’s a JSON object with a sentiment of positive, negative or mixed, and one to three themes that are all on the list. Anything else raises an error.",
      "Self-correction: when an answer fails, the model gets its own answer back along with the exact error (“themes not in taxonomy: ‘graphics’”) and is asked to reply again with corrected JSON. In testing this cut failures from 30% to 2%.",
      "After three tries the review is recorded as a failure, along with the reason. Nothing is guessed or filled in.",
      "Failure-rate threshold: if more than 5% of reviews fail, the run prints “DATA INTEGRITY FAIL: do not report these results” and exits with an error code.",
      "Fail fast: before downloading anything, the pipeline checks that Ollama is running and that the model is installed.",
    ],
  },
  {
    title: "Measuring accuracy and comparing models",
    summary:
      "The LLM is evaluated against reviewers’ own Steam ratings and a blind, hand-labeled audit set, with confidence intervals. Four open-source models (3B–12B) are being benchmarked on accuracy, speed and reliability.",
    how: [
      "Steam check: the model’s positive/negative call is compared with the reviewer’s thumbs up/down. “Mixed” answers are left out because Steam has no “mixed” vote.",
      "Blind audit: a random sample of 25 reviews per game (fixed seed, so it’s reproducible) is exported with the review text only. I label those by hand, and a scoring script reports accuracy and a confusion matrix showing exactly which labels get mixed up.",
      "Benchmark: Llama 3.2 3B, Llama 3.1 8B, Qwen 2.5 7B and Gemma 3 12B each label the exact same reviews with the same prompt and the same checks.",
      "For each model it measures failure rate, how often the first answer was already valid, seconds per review, how often it says “mixed” or falls back to “other”, Steam agreement and hand-label accuracy, plus how often each pair of models agrees.",
      "Every accuracy figure comes with a 95% confidence range (Wilson score interval), so small differences aren’t mistaken for real ones.",
    ],
  },
];

// Docs and references the build relies on. Add or swap in anything else you read along the way.
const RESOURCES = [
  { label: "Steam: User Reviews API (appreviews)", href: "https://partner.steamgames.com/doc/store/getreviews" },
  { label: "Ollama API reference (chat, JSON mode)", href: "https://github.com/ollama/ollama/blob/main/docs/api.md" },
  { label: "Ollama model library: Llama, Qwen, Gemma", href: "https://ollama.com/library" },
  { label: "pandas documentation", href: "https://pandas.pydata.org/docs/" },
  { label: "Wilson score interval for proportions", href: "https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval" },
];

const BUMPS = [
  {
    title: "Paying per review didn’t fit the job",
    problem:
      "I first built this on Azure OpenAI endpoints with GPT-4. Every review cost money, so every rerun or prompt tweak was a cost decision. And a hosted model can be retired, which would leave the pipeline built on something that’s going away.",
    fix: "I moved to free, open-source models running locally through Ollama (Llama 3.1, Qwen 2.5, Gemma 3) on my own GPU.",
    result:
      "It costs nothing per review, so I can rerun experiments freely. It also opened up a new question I wanted to learn: how do different models compare on the same task?",
  },
  {
    title: "The model didn’t always follow the rules",
    problem: "Some answers came back malformed or used themes that weren’t on the list.",
    fix: "I added validation plus a self-correction loop: an invalid answer goes back to the model along with the error message.",
    result: "In testing, failures dropped from 30% to 2%.",
  },
  {
    title: "Agreement isn’t the same as accuracy",
    problem:
      "Steam thumbs are a free accuracy check, but they’re only up or down, while the model can say “mixed”. And if I labeled reviews while seeing the model’s answer, I’d be biased toward agreeing with it.",
    fix: "“Mixed” is left out of the Steam check, and the hand-label sample is blind: it shows only the review text, with no model answer and no thumbs.",
    result: "Two independent views of accuracy instead of one.",
  },
  {
    title: "Small samples can fool you",
    problem: "With 100 reviews per game, a few points of difference between two models can be pure chance.",
    fix: "Every model score comes with a 95% confidence range (Wilson score interval).",
    result: "If two models’ ranges overlap, I treat them as tied rather than declaring a winner.",
  },
  {
    title: "Timing models fairly on one GPU",
    problem: "Loading a model into memory takes time, and two models sharing the GPU slow each other down.",
    fix: "Each model is loaded before the timer starts and unloaded afterwards. Every model labels the exact same reviews, and labels are cached so adding a new model doesn’t redo the old ones.",
    result: "Speed and accuracy differences come from the model alone.",
  },
];

const ROADMAP = [
  // status: "done", "in progress" or "up next". When a phase finishes, update it and add a line with the result.
  { status: "done", title: "Phase 1", body: "Classification pipeline with validation and self-correction." },
  { status: "in progress", title: "Phase 2", body: "Benchmarking four open-source models against hand-labeled data." },
  { status: "up next", title: "Phase 3", body: "Scaling to thousands of reviews in a SQL database." },
  { status: "up next", title: "Phase 4", body: "Monthly theme trends and backtested sentiment projections." },
];

// Chapter titles, in order: used for the headings and the table of contents
const CHAPTERS = [
  "The problem",
  "What I reviewed",
  "The requirements",
  "The workflow, step by step",
  "How I built it",
  "Bumps in the road",
  "Where it stands",
  "Why it matters for product",
];

export default function HeroShooterCaseStudy() {
  return (
    <CaseStudyPage link={{ href: REPO_URL, label: "view the code on GitHub →" }}>
      {/* ---------- Intro ---------- */}
      <header className="mt-14">
        <p className={kicker}>Case study · Data &amp; AI · 2026</p>
        <h1 className="mt-3 font-display text-wide text-[clamp(1.9rem,5.5vw,3.6rem)] leading-[1.05] font-black uppercase">
          What are hero shooter players complaining about?
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed">
          An LLM pipeline that reads Steam reviews of Overwatch 2 and Marvel Rivals,
          finds the themes players keep raising, and checks its own work before reporting anything.
        </p>

        <dl className="mt-8 grid gap-6 sm:grid-cols-3">
          <div>
            <dt className={kicker}>My role</dt>
            <dd className="mt-1 text-[15px]">Product framing, requirements, build and evaluation</dd>
          </div>
          <div>
            <dt className={kicker}>Status</dt>
            <dd className="mt-1 text-[15px]">Phase 2 of 4: comparing models</dd>
          </div>
          <div>
            <dt className={kicker}>Skills</dt>
            <dd className="mt-1 font-hand text-xl leading-snug">{SKILLS.join(" · ")}</dd>
          </div>
        </dl>

        <Reveal className="bio-frame mt-12 px-6 pt-8 pb-6 sm:px-8" delay={100}>
          <p className="font-hand text-2xl leading-none">the short version</p>
          <ul className={`mt-3 space-y-2 ${prose}`}>
            <li>★ <strong>Problem statement:</strong> where does each game lose players’ goodwill, and which complaints are shared across the genre?</li>
            <li>★ <strong>What I built:</strong> a Python pipeline where a local LLM tags each review with a sentiment and up to three themes, then compares the two games.</li>
            <li>★ <strong>Validation:</strong> a self-correction loop and accuracy checks.</li>
          </ul>
        </Reveal>
        <Contents chapters={CHAPTERS} />
      </header>

      {/* ---------- 1. Problem ---------- */}
      <Chapter number={1} title={CHAPTERS[0]}>
        <div className={`max-w-2xl space-y-4 ${prose}`}>
          <p>
            Overwatch 2 and Marvel Rivals are both free-to-play hero shooters, competing for the same players. In a
            free-to-play game, when players get frustrated, they stop logging in.
          </p>
          <p>
            Steam shows a percentage of positive reviews, but that only tells you <em>how many</em> players are
            unhappy, not <em>why</em>. The “why” is buried in thousands of free-text reviews that nobody has time to
            read one by one.
          </p>
        </div>
        <Reveal className="taped sketch-border relative mx-auto mt-10 max-w-xl -rotate-1 bg-card px-6 pt-8 pb-6 text-center shadow-[3px_4px_0_rgba(0,0,0,0.08)]">
          <p className={kicker}>Problem statement</p>
          <p className="mt-2 font-hand text-2xl leading-snug">
            Which complaints are shared across the genre versus specific to
            one game?
          </p>
        </Reveal>
      </Chapter>

      {/* ---------- 2. What I reviewed ---------- */}
      <Chapter number={2} title={CHAPTERS[1]}>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <p className="font-hand text-2xl leading-none">the source</p>
            <p className="mt-2 text-[14.5px] leading-relaxed">
              Steam’s public review API. Every review comes with the reviewer’s own thumbs up/down and their playtime,
              which gave me a built-in way to sanity-check the model.
            </p>
          </Card>
          <Card>
            <p className="font-hand text-2xl leading-none">the vocabulary</p>
            <p className="mt-2 text-[14.5px] leading-relaxed">
              I read through reviews to see what players talk about, then turned that into a fixed list of
              nine themes. A fixed list is what makes the two games comparable.
            </p>
          </Card>
          <Card>
            <p className="font-hand text-2xl leading-none">the models</p>
            <p className="mt-2 text-[14.5px] leading-relaxed">
              I started on Azure OpenAI with GPT-4, then moved to free open-source models (Llama, Qwen, Gemma) run
              locally with Ollama. More on why below.
            </p>
          </Card>
        </div>

        <Reveal className="notepad mt-10 px-5 pt-7 pb-5 sm:pl-14 sm:pr-6">
          <p className="font-hand text-2xl leading-none">the nine themes</p>
          <ul className="mt-3 grid gap-x-8 gap-y-1.5 text-[14px] leading-snug sm:grid-cols-2">
            {THEMES.map(([name, desc]) => (
              <li key={name}>
                <strong>{name}</strong> <span className="opacity-75">— {desc}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Chapter>

      {/* ---------- 3. Requirements ---------- */}
      <Chapter number={3} title={CHAPTERS[2]}>
        <p className={`max-w-2xl ${prose}`}>
          Before writing any code, I wrote down what “done” had to mean.
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

      {/* ---------- 4. Workflow ---------- */}
      <Chapter number={4} title={CHAPTERS[3]}>
        <p className={`max-w-2xl ${prose}`}>
          Here’s the journey from a question to an answer!
        </p>
        <Steps steps={WORKFLOW} />
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
        <p className={`max-w-2xl ${prose}`}>
          LLM output can’t be taken at face value. Most of this project was finding where it breaks and
          building in a check. It also meant learning how to measure accuracy and compare models fairly, a skill I’m still building.
        </p>
        <Bumps bumps={BUMPS} />
      </Chapter>

      {/* ---------- 7. Roadmap ---------- */}
      <Chapter number={7} title={CHAPTERS[6]}>
        <Roadmap phases={ROADMAP} />
      </Chapter>

      {/* ---------- 8. Takeaways ---------- */}
      <Chapter number={8} title={CHAPTERS[7]}>
        <div className={`max-w-2xl space-y-4 ${prose}`}>
          <p>What I learned about working with LLMs:</p>
          <ul className="space-y-2">
            <li>✦ Every piece of the pipeline answers one question: which complaints cost each game its players?</li>
            <li>✦ The integrity gate and accuracy checks were requirements from the start.</li>
            <li>✦ Free local models let me rerun experiments and practice comparing models.</li>
            <li>✦ I validate and deploy each piece before building the next.</li>
          </ul>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
          <InkLink href={REPO_URL} external className="font-hand text-3xl">view the code on GitHub →</InkLink>
          <InkLink href="/#contact" className="font-hand text-2xl">questions? let’s talk ♡</InkLink>
        </div>
      </Chapter>
    </CaseStudyPage>
  );
}
