// Shared building blocks for the case study pages under /projects/.
import InkLink from "./InkLink";
import Reveal from "./Reveal";

export const kicker = "font-nav text-[10px] tracking-widest uppercase";
export const prose = "text-[15.5px] leading-relaxed xl:text-[17px]";

// Page shell: back link on the left, an optional outside link (e.g. GitHub) on the right
export function CaseStudyPage({ link, children }) {
  return (
    <div className="overflow-x-clip px-5 sm:px-10">
      <div className="mx-auto max-w-4xl pt-8 pb-24">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <InkLink href="/#portfolio" className="font-hand text-2xl">← back to portfolio</InkLink>
          {link && (
            <InkLink href={link.href} external className="font-hand text-2xl">{link.label}</InkLink>
          )}
        </nav>
        {children}
      </div>
    </div>
  );
}

// "The problem" → "the-problem", so the table of contents can link to each chapter
const chapterId = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Table of contents: pass the chapter titles in order (the same strings given to each <Chapter title>)
export function Contents({ chapters }) {
  return (
    <Reveal as="nav" aria-label="Table of contents" className="notepad mt-12 px-5 pt-7 pb-5 sm:pl-14 sm:pr-6">
      <p className="font-hand text-2xl leading-none">what’s inside</p>
      <ol className="mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
        {chapters.map((title, i) => (
          <li key={title} className="flex items-baseline gap-2">
            <span className="w-5 shrink-0 font-hand text-xl opacity-60">{i + 1}</span>
            <a href={`#${chapterId(title)}`} className="text-[15px] text-ink underline-offset-4 hover:underline">
              {title}
            </a>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

export function Chapter({ number, title, children }) {
  return (
    <section id={chapterId(title)} className="mt-20 scroll-mt-8">
      <Reveal>
        <p className="-rotate-2 font-hand text-2xl opacity-70">chapter {number}</p>
        <h2 className="mt-1 font-display text-wide text-[clamp(1.4rem,3.4vw,2.25rem)] leading-tight font-black uppercase">{title}</h2>
      </Reveal>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Card({ className = "", children }) {
  return <div className={`sketch-border bg-card px-5 py-4 shadow-[3px_4px_0_rgba(0,0,0,0.08)] ${className}`}>{children}</div>;
}

// Numbered steps hanging off a dashed line
export function Steps({ steps }) {
  return (
    <ol className="relative mt-10 space-y-8 border-l-[2.5px] border-dashed border-ink/50 pl-8 sm:pl-10">
      {steps.map((step, i) => (
        <Reveal as="li" key={step.title} className="relative">
          {/* Circle centered on the dashed line: left = -(list padding + half the line + half the circle).
              Caveat digits lean right, so pr nudges them back to the visual center. */}
          <span
            aria-hidden="true"
            className="absolute top-0 left-[calc(-3.25rem-1.25px)] flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-ink bg-card pr-[5px] pb-0.5 font-hand text-2xl leading-none sm:left-[calc(-3.75rem-1.25px)]"
          >
            {i + 1}
          </span>
          <h3 className="pt-1.5 text-lg leading-snug font-bold">{step.title}</h3>
          <p className="mt-1 max-w-2xl text-[15px] leading-relaxed">{step.body}</p>
          {step.detail && (
            <figure className="mt-3 max-w-2xl">
              {step.detailLabel && <figcaption className="font-hand text-lg opacity-70">{step.detailLabel}</figcaption>}
              <pre className="overflow-x-auto rounded-md border-2 border-ink bg-ink px-4 py-3 text-[13px] leading-relaxed text-card">
                <code>{step.detail}</code>
              </pre>
            </figure>
          )}
        </Reveal>
      ))}
    </ol>
  );
}

// "How I built it" cards: a plain-language summary, with the technical details in a fold-out list
export function BuildParts({ parts }) {
  return (
    <div className="mt-8 space-y-8">
      {parts.map((part, i) => (
        <Reveal key={part.title}>
          <div className="bio-frame px-6 pt-6 pb-5 sm:px-8">
            <p className={kicker}>part {i + 1} of {parts.length}</p>
            <h3 className="mt-1 text-xl leading-snug font-bold">{part.title}</h3>
            <p className={`mt-2 ${prose}`}>{part.summary}</p>
            <details className="group mt-3">
              <summary className="cursor-pointer font-hand text-xl">
                <span className="group-open:hidden">how it works ↓</span>
                <span className="hidden group-open:inline">hide the details ↑</span>
              </summary>
              <ul className="mt-2 space-y-2 text-[14.5px] leading-relaxed">
                {part.how.map((point) => (
                  <li key={point}>✎ {point}</li>
                ))}
              </ul>
            </details>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

// Links to the docs and references a project relied on
export function Resources({ links }) {
  return (
    <Reveal className="notepad mt-12 px-5 pt-7 pb-5 sm:pl-14 sm:pr-6">
      <p className="font-hand text-2xl leading-none">resources</p>
      <ul className="mt-3 space-y-1.5 text-[14.5px] leading-snug">
        {links.map((r) => (
          <li key={r.href}>
            <a href={r.href} target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2">
              {r.label}
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

// "The issue / What I did / The result" cards, staggered left and right
export function Bumps({ bumps }) {
  return (
    <div className="mt-8 space-y-8">
      {bumps.map((b, i) => (
        <Reveal key={b.title} className={i % 2 ? "sm:ml-10" : "sm:mr-10"}>
          <Card>
            <h3 className="font-hand text-[1.7rem] leading-tight">{b.title}</h3>
            {/* Any of the three can be left out; the columns adjust */}
            <dl className={`mt-2 grid gap-3 text-[14.5px] leading-relaxed sm:gap-6 ${b.fix ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              {[["The issue", b.problem], ["What I did", b.fix], ["The result", b.result]]
                .filter(([, text]) => text)
                .map(([label, text]) => (
                  <div key={label}>
                    <dt className={kicker}>{label}</dt>
                    <dd className="mt-1">{text}</dd>
                  </div>
                ))}
            </dl>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

// Roadmap phases with a hand-written status label: "done", "in progress" or "up next"
export function Roadmap({ phases }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {phases.map((phase) => (
        <Reveal as="li" key={phase.title}>
          <Card className="h-full">
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-bold">{phase.title}</p>
              <span
                className={`sketch-border shrink-0 px-2.5 font-hand text-lg leading-snug ${
                  phase.status === "done" ? "bg-ink text-card" : phase.status === "in progress" ? "bg-white" : "opacity-60"
                }`}
              >
                {phase.status}
              </span>
            </div>
            <p className="mt-1 text-[14.5px] leading-relaxed">{phase.body}</p>
          </Card>
        </Reveal>
      ))}
    </ul>
  );
}
