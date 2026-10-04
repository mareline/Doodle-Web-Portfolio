import { useState } from "react";
import Doodle from "./Doodle";
import DoodleScroller from "./DoodleScroller";
import Note from "./Note";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { VOLUNTEER, WORK } from "../data/work";

const groupHeading = "font-nav text-sm tracking-widest uppercase";

// One role on its own white card. Click the role/company to open what I did and what I learned.
function JobCard({ job, onToggle }) {
  const [open, setOpen] = useState(false);
  const hasDetails =
    job.highlights?.length > 0 || job.learned?.length > 0 || job.note;

  return (
    <div className="bio-frame paper-hover mt-2 px-4 py-3">
      <button
        type="button"
        aria-expanded={open}
        disabled={!hasDetails}
        onClick={() => {
          setOpen((v) => !v);
          onToggle?.();
        }}
        className="group block w-full cursor-pointer bg-transparent p-0 text-left disabled:cursor-default"
      >
        <span className="block text-base leading-snug font-bold group-hover:underline group-hover:underline-offset-4">
          {job.role}
        </span>
        <span className="mt-0.5 block font-nav text-[11px] tracking-widest uppercase opacity-80">
          {job.company}
        </span>
        {hasDetails && (
          <span className="mt-1.5 block font-hand text-lg leading-none opacity-70">
            {open ? "close ↑" : "more ↓"}
          </span>
        )}
      </button>

      {open && (
        <div className="mt-2 text-[13.5px] leading-snug">
          {job.note && <p className="italic opacity-80">{job.note}</p>}
          {job.highlights?.length > 0 && (
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              {job.highlights.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          )}
          {job.learned?.length > 0 && (
            <>
              <p className="mt-3 font-nav text-[10px] tracking-widest uppercase">
                What I learned
              </p>
              <ul className="mt-1 space-y-0.5">
                {job.learned.map((lesson) => (
                  <li key={lesson}>✦ {lesson}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// A horizontal, hand-drawn timeline: most recent on the left, oldest on the right.
// On narrow screens it scrolls sideways.
function Timeline({ entries, onToggle }) {
  return (
    <DoodleScroller className="-mx-5 sm:-mx-10 lg:mx-0">
      <div className="px-5 pb-2 sm:px-10 lg:px-0">
        <ol className="relative grid w-max min-w-full grid-flow-col gap-8 [grid-auto-columns:16rem] lg:w-full lg:[grid-auto-columns:minmax(0,1fr)]">
          {/* the line running through every dot, ending in an arrow */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 12"
            preserveAspectRatio="none"
            className="pointer-events-none absolute top-[2.625rem] left-0 h-3 w-full"
          >
            <path
              d="M2 6 C 160 2, 320 10, 500 6 S 840 2, 985 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M985 6 L 972 1 M985 6 L 972 11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {entries.map((job, i) => (
            <Reveal
              as="li"
              key={`${job.company}-${job.role}`}
              delay={i * 90}
              className="relative"
            >
              <p className="h-8 -rotate-2 font-hand text-xl leading-8">
                {job.dates}
              </p>
              <span
                aria-hidden="true"
                className="relative z-10 my-2 block h-4 w-4 rounded-full border-[2.5px] border-ink bg-card"
              />
              <JobCard job={job} onToggle={onToggle} />
            </Reveal>
          ))}
        </ol>
      </div>
    </DoodleScroller>
  );
}

export default function Work({ onPop }) {
  // Each time a role is opened or closed, the stars and sparkles do a little hop-and-spin
  const [hops, setHops] = useState(0);
  const hop = () => setHops((n) => n + 1);

  const groups = [
    { title: "Experience", entries: WORK },
    { title: "Volunteer & community", entries: VOLUNTEER },
  ].filter((group) => group.entries.length > 0);

  return (
    <section id="work" data-hop={hops === 0 ? undefined : hops % 2 ? "a" : "b"} className="relative scroll-mt-32">
      {/* sparkles and stars scattered around the page */}
      <Doodle
        name="stars"
        hop
        onPop={onPop}
        float
        depth={6}
        className="absolute -top-4 right-0 hidden w-28 md:block lg:w-32"
      />
      <Doodle
        name="sparkles"
        onPop={onPop}
        depth={4}
        className="absolute -bottom-6 -left-4 hidden w-14 -rotate-12 lg:block"
      />

      <div className="flex items-center gap-5">
        <SectionHeading>Work</SectionHeading>
        <Doodle
          name="sparkles"
          onPop={onPop}
          float
          depth={4}
          className="w-11 sm:w-12"
        />
      </div>

      {groups.length === 0 ? (
        <Note className="mt-10">
          Experience details are on their way. Find me on LinkedIn in the
          meantime!
        </Note>
      ) : (
        groups.map((group, i) => (
          <div key={group.title} className={i === 0 ? "mt-8" : "mt-10"}>
            <div className="flex flex-wrap items-baseline gap-x-4">
              <h3 className={groupHeading}>{group.title}</h3>
              <span className="font-hand text-lg opacity-60 sm:whitespace-nowrap">
                newest → oldest · tap a role for more
              </span>
              {i === 1 && (
                <Doodle
                  name="sparkles"
                  onPop={onPop}
                  float
                  depth={-4}
                  className="ml-[18%] hidden w-11 self-center lg:block"
                />
              )}
            </div>
            <div className="mt-3">
              <Timeline entries={group.entries} onToggle={hop} />
            </div>
          </div>
        ))
      )}
    </section>
  );
}
