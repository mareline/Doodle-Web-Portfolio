import { useEffect, useRef, useState } from "react";
import InkLink from "./InkLink";
import Note from "./Note";
import Reveal from "./Reveal";
import SafeImage from "./SafeImage";
import SectionHeading from "./SectionHeading";
import { PaperClip, Pencil, PencilMarks } from "./Sketches";
import { PROJECTS } from "../data/projects";
import { SUBSTACK_URL } from "../data/site";
import WRITING from "../data/writing.json";

const LATEST_POSTS = 2; // only the newest essays are shown; the rest are a click away on Substack
const ICON_TILTS = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1"];
const CARD_TILTS = ["-rotate-1", "rotate-1"];

const formatDate = (iso) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

const PROJECT_ITEMS = PROJECTS.map((project) => ({
  label: project.title,
  title: project.title,
  type: project.type,
  summary: project.summary,
  tags: project.tags,
  href: project.href,
  caseStudy: project.caseStudy,
  cta: project.caseStudy ? "view the code →" : "open it →",
}));

const POSTS = WRITING.slice(0, LATEST_POSTS);
const CASE_STUDIES = PROJECTS.filter((project) => project.caseStudy);

function FolderIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 80" className="desk-icon-art h-auto w-full stroke-ink" strokeWidth="3" strokeLinejoin="round">
      <path className="fill-card" d="M5 14 Q5 8 11 8 L36 8 L44 16 L89 16 Q95 16 95 22 L95 70 Q95 76 89 76 L11 76 Q5 76 5 70 Z" />
      <path className="fill-white" strokeWidth="2" d="M14 22 L84 20 L86 50 L12 52 Z" />
      <path className="folder-front fill-[#e4dfd2]" d="M5 30 Q5 27 9 27 L91 27 Q95 27 95 31 L93 71 Q93 76 88 76 L12 76 Q7 76 7 71 Z" />
    </svg>
  );
}

function DesktopIcon({ item, tilt, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={`desk-icon paper-hover-art group flex w-28 cursor-pointer xl:w-36 flex-col items-center gap-2 rounded-lg p-2 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink focus-visible:outline-dashed ${tilt}`}
    >
      <span className="w-20">
        <FolderIcon />
      </span>
      <span className="line-clamp-3 px-1.5 font-hand text-xl leading-tight group-hover:underline">{item.label}</span>
    </button>
  );
}

// The project folders lie loose on the sketchbook page, with pencils and pencil marks scattered around
const FOLDER_NUDGE = ["translate-y-2", "-translate-y-3", "translate-y-4"];

function Desktop({ items, empty, onOpen }) {
  if (items.length === 0) return <Note className="mt-8">{empty}</Note>;
  return (
    <div className="relative mt-6 flex-1 pt-6 pb-24">
      <PencilMarks variant={0} className="absolute -top-2 right-[8%] w-24" />
      <PencilMarks variant={3} className="absolute bottom-24 left-[2%] w-20" />
      <PencilMarks variant={1} className="absolute right-[4%] bottom-10 w-28" />

      <Reveal as="ul" className="relative z-10 flex flex-wrap justify-around gap-x-6 gap-y-10 pt-16">
        {items.map((item, i) => (
          <li key={item.href ?? item.title} className={`relative ${FOLDER_NUDGE[i % FOLDER_NUDGE.length]}`}>
            {/* The note always sits above the newest project (first in projects.js) and points down at it */}
            {i === 0 && (
              <p className="absolute bottom-full left-1/2 mb-1 flex -translate-x-[15%] items-end gap-1 font-hand text-xl whitespace-nowrap opacity-80 max-sm:w-44 max-sm:whitespace-normal">
                <svg aria-hidden="true" viewBox="0 0 50 50" className="h-10 w-10 shrink-0 fill-none stroke-ink" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M44 6 C 22 6, 12 18, 12 42" />
                  <path d="M12 42 L 5 32 M12 42 L 20 33" />
                </svg>
                <span className="-rotate-3 pb-6">newest! click a folder to peek inside</span>
              </p>
            )}
            <DesktopIcon item={item} tilt={ICON_TILTS[i % ICON_TILTS.length]} onOpen={onOpen} />
          </li>
        ))}
      </Reveal>

      <Pencil className="absolute bottom-6 left-[30%] w-56 -rotate-[8deg] lg:w-64" />
      <Pencil className="absolute right-[10%] bottom-0 w-40 rotate-[164deg] opacity-90" />
    </div>
  );
}

// Sticky note with the essay's cover, taped to the page
function PostCard({ post, tilt }) {
  return (
    <a
      href={post.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`taped sketch-border paper-hover relative block h-full bg-card text-ink no-underline shadow-[3px_4px_0_rgba(0,0,0,0.08)] ${tilt}`}
    >
      {post.image && (
        <div className="m-3 mb-0 aspect-[4/3] overflow-hidden border-2 border-ink bg-ink/10">
          <SafeImage src={`${import.meta.env.BASE_URL}images/${post.image}`} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <p className="font-nav text-[10px] tracking-widest uppercase">Substack · {formatDate(post.date)}</p>
        <h4 className="mt-1 text-lg leading-snug font-bold">{post.title}</h4>
        {post.summary && <p className="mt-2 text-sm leading-relaxed">{post.summary}</p>}
        <p className="mt-2 font-hand text-xl">read it →</p>
      </div>
    </a>
  );
}

// Ruled notebook lines for the case study papers
const RULED = {
  backgroundImage: "repeating-linear-gradient(transparent 0 calc(1.5rem - 1px), rgb(26 26 26 / 0.1) calc(1.5rem - 1px) 1.5rem)",
  backgroundPosition: "0 1.1rem",
};

// Case studies shelf: a manila folder with a paperclipped sheet sliding out of it (further out on hover).
// The folder's front pocket hides the bottom of the sheet and carries the "read" label.
function CaseStudyCard({ project, tilt }) {
  return (
    <a href={project.caseStudy} className={`group relative block h-full pt-5 text-ink no-underline ${tilt}`}>
      {/* back of the folder, with its tab */}
      <span aria-hidden="true" className="absolute top-[2.6rem] left-5 h-6 w-24 rounded-t-lg border-[2.5px] border-b-0 border-ink bg-card" />
      <span aria-hidden="true" className="absolute inset-x-0 top-16 bottom-0 rounded-md border-[2.5px] border-ink bg-card shadow-[3px_4px_0_rgba(0,0,0,0.08)]" />

      {/* the sheet */}
      <div
        style={RULED}
        className="relative z-10 mx-4 -rotate-[1.5deg] border-2 border-ink/80 bg-[#fdfcf8] px-4 pt-5 pb-20 shadow-[1px_2px_0_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out group-hover:-translate-y-3 group-hover:-rotate-[3deg] group-focus-visible:-translate-y-3 motion-reduce:transition-none"
      >
        <PaperClip className="absolute -top-6 right-7 w-5 rotate-[10deg]" />
        <p className="font-nav text-[10px] tracking-widest uppercase">Case study · {project.type}</p>
        <h4 className="mt-1 text-lg leading-snug font-bold">{project.title}</h4>
        <p className="mt-2 text-sm leading-relaxed">{project.teaser}</p>
      </div>

      {/* front pocket of the folder */}
      <span className="absolute inset-x-0 bottom-0 z-20 flex h-[4.25rem] items-center rounded-b-md border-[2.5px] border-ink bg-[#e4dfd2] px-5">
        <span className="font-hand text-2xl group-hover:underline group-hover:underline-offset-4">read the case study →</span>
      </span>
    </a>
  );
}

// A hand-drawn "window" that opens when you click a folder
function DesktopWindow({ item, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (item && dialog && !dialog.open) dialog.showModal();
  }, [item]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && dialogRef.current.close()}
      aria-labelledby="desk-window-title"
      className="desk-window sketch-border m-auto w-[min(92vw,30rem)] bg-card p-0 text-ink backdrop:bg-ink/30"
    >
      {item && (
        <>
          <div className="flex items-center gap-3 border-b-[2.5px] border-ink px-4 py-2">
            <p className="flex-1 truncate font-nav text-[10px] tracking-widest uppercase">
              projects / {item.label}
            </p>
            <button
              type="button"
              onClick={() => dialogRef.current.close()}
              aria-label="Close"
              className="cursor-pointer font-hand text-3xl leading-none"
            >
              ×
            </button>
          </div>
          <div className="px-5 pt-4 pb-5">
            {item.type && <p className="font-nav text-[10px] tracking-widest uppercase">{item.type}</p>}
            <h4 id="desk-window-title" className="mt-1 text-xl leading-snug font-bold">{item.title}</h4>
            {item.summary && <p className="mt-3 text-[15px] leading-relaxed xl:text-[17px]">{item.summary}</p>}
            {item.tags?.length > 0 && <p className="mt-3 font-hand text-xl opacity-80">{item.tags.join(" · ")}</p>}
            {(item.caseStudy || item.href) && (
              <p className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
                {item.caseStudy && (
                  <InkLink href={item.caseStudy} className="font-hand text-2xl">
                    read the case study →
                  </InkLink>
                )}
                {item.href && (
                  <InkLink href={item.href} external className="font-hand text-2xl">
                    {item.cta}
                  </InkLink>
                )}
              </p>
            )}
          </div>
        </>
      )}
    </dialog>
  );
}

const shelfHeading = "font-nav text-sm tracking-widest uppercase";

export default function Portfolio() {
  const [openItem, setOpenItem] = useState(null);

  return (
    <section id="portfolio" className="scroll-mt-32">
      <SectionHeading>Portfolio</SectionHeading>

      {/* Projects and writing side by side, equal halves, same height */}
      <div className="mt-10 grid items-stretch gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col">
          <h3 className={shelfHeading}>Projects</h3>
          <p className="mt-2 max-w-prose text-[15px] leading-relaxed xl:text-[17px]">
            Things I’ve designed and built: an LLM pipeline for analyzing player reviews, interactive 3D websites like this
            sketchbook, plus backend and full-stack coursework in Java and SQL.
          </p>
          <Desktop items={PROJECT_ITEMS} empty="Case studies are being written up. Check back soon!" onOpen={setOpenItem} />
          {/* Case studies sit right under the project folders */}
          {CASE_STUDIES.length > 0 && (
            <div id="case-studies" className="mt-4 scroll-mt-32">
              <div className="flex flex-wrap items-baseline gap-x-4">
                <h3 className={shelfHeading}>Case studies</h3>
                <span className="font-hand text-lg opacity-60">the full story: problem, requirements, workflow and what went wrong</span>
              </div>
              <ul className="mt-8 grid gap-10 sm:grid-cols-2">
                {CASE_STUDIES.map((project, i) => (
                  <Reveal as="li" key={project.caseStudy} delay={i * 120}>
                    <CaseStudyCard project={project} tilt={CARD_TILTS[i % CARD_TILTS.length]} />
                  </Reveal>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h3 className={shelfHeading}>Latest writing</h3>
            <InkLink href={SUBSTACK_URL} external className="font-hand text-2xl">
              more on Substack →
            </InkLink>
          </div>
          <p className="mt-2 max-w-prose text-[15px] leading-relaxed xl:text-[17px]">
            Essays on video games through a product lens, neurodiversity, early-career lessons, and what I’m learning in
            my MBA.
          </p>
          {POSTS.length === 0 ? (
            <Note className="mt-10">New essays are on the way. Check back soon!</Note>
          ) : (
            <ul className="mt-10 grid gap-10 sm:grid-cols-2">
              {POSTS.map((post, i) => (
                <Reveal as="li" key={post.href} delay={i * 120}>
                  <PostCard post={post} tilt={CARD_TILTS[i % CARD_TILTS.length]} />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </div>

      <DesktopWindow item={openItem} onClose={() => setOpenItem(null)} />
    </section>
  );
}
