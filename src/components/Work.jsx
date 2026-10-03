import Note from "./Note";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { VOLUNTEER, WORK } from "../data/work";

const groupHeading = "font-nav text-sm tracking-widest uppercase";

function Timeline({ entries }) {
  return (
    <div className="relative mt-8">
      {/* hand-drawn timeline */}
      <svg aria-hidden="true" viewBox="0 0 10 100" preserveAspectRatio="none" className="absolute top-2 left-1.5 h-[calc(100%-1rem)] w-3">
        <path d="M5 0 C 3 20, 7 40, 5 60 S 4 85, 5 100" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>

      <ol className="space-y-10 pl-8">
        {entries.map((job) => (
          <Reveal as="li" key={`${job.company}-${job.role}`} className="relative">
            <span aria-hidden="true" className="absolute top-1.5 left-[-1.75rem] h-4 w-4 rounded-full border-[2.5px] border-ink bg-card" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h4 className="text-lg font-bold">
                {job.role} · {job.company}
              </h4>
              <span className="-rotate-2 font-hand text-xl">{job.dates}</span>
            </div>
            {job.highlights?.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed">
                {job.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

export default function Work() {
  const groups = [
    { title: "Experience", entries: WORK },
    { title: "Volunteer & community", entries: VOLUNTEER },
  ].filter((group) => group.entries.length > 0);

  return (
    <section id="work" className="scroll-mt-6 py-14">
      <SectionHeading>Work</SectionHeading>

      {groups.length === 0 ? (
        <Note className="mt-10">Experience details are on their way. Find me on LinkedIn in the meantime!</Note>
      ) : (
        groups.map((group, i) => (
          <div key={group.title} className={i === 0 ? "mt-12" : "mt-16"}>
            <h3 className={groupHeading}>{group.title}</h3>
            <Timeline entries={group.entries} />
          </div>
        ))
      )}
    </section>
  );
}
