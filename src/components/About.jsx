import { useEffect, useRef, useState } from "react";
import Doodle from "./Doodle";
import Cat from "./Cat";
import Reveal from "./Reveal";
import SafeImage from "./SafeImage";
import SectionHeading from "./SectionHeading";
import { Coffee, FeatherWand, ToyMouse, YarnBall } from "./Sketches";
import { imageUrl } from "../data/images";
import { SITE, SUBSTACK_URL } from "../data/site";

const LINKEDIN_URL = SITE.links.find((link) => link.label === "LinkedIn")?.href;

const STRENGTHS = [
  {
    title: "Product Strategy & Cloud Infrastructure",
    body: "Proven experience leading technical teams, standardizing delivery roadmaps, and shipping Generative AI/cloud workloads in high-stakes environments.",
  },
  {
    title: "Creative Technical Craft",
    body: "CS degree background with hands-on skill across full-stack development, 3D/interactivity (ThreeJS, React, Python), and UI/UX prototyping.",
  },
  {
    title: "Systems & Gaming Lens",
    body: "Deep fascination with how games build immersion and retain users—often writing product breakdowns on titles like Devil May Cry, Resident Evil, Silent Hill 2 and more.",
  },
  {
    title: "Community Leadership",
    body: "Active mentor and advocate passionate about inclusion, neurodiversity, and empowering early-career tech communities.",
  },
];

// Toolbox: click a tool to see how it's actually used (details drawn from your resume)
const TOOLBOX = [
  {
    label: "Product & delivery",
    tools: [
      { name: "Jira", detail: "Tracking epics and releases, with a dashboard that flags blockers so delivery stays on schedule." },
      { name: "JQL", detail: "Queries that automate data-quality checks and surface internal & external dependencies." },
      { name: "Confluence", detail: "Documenting and standardizing the product lifecycle and team processes." },
      { name: "SAFe", detail: "Trained in Scaled Agile Framework product management practices." },
    ],
  },
  {
    label: "Data & analytics",
    tools: [
      { name: "SQL", detail: "Querying and modeling data (MySQL), from coursework to analysis." },
      { name: "Tableau", detail: "Turning data into dashboards and visual stories." },
      { name: "Excel", detail: "Modeling a year of delivery data to forecast timelines for common delivery types." },
    ],
  },
  {
    label: "Azure AI services",
    tools: [
      { name: "Azure AI Fundamentals", detail: "I enable Azure AI services, and I have the fundamentals down: what each service does and when to use it." },
      { name: "Azure AI Foundry", detail: "Working with AI models: learning each model’s capabilities and pointing customers to the right one for their needs." },
      { name: "Azure OpenAI", detail: "Enabling Generative AI workloads across multiple lines of business." },
      { name: "Azure Cloud", detail: "Cloud platform services: enabling workloads and platforms, including secondary regions." },
    ],
  },
  {
    label: "Build",
    tools: [
      { name: "React", detail: "Interactive front ends, including this sketchbook site." },
      { name: "Three.js", detail: "3D on the web, like my 2023 3D portfolio." },
      { name: "JavaScript", detail: "The language behind my web projects." },
      { name: "Python", detail: "Scripting, data work, and my 100 Days of Python practice." },
      { name: "FastAPI", detail: "Building lightweight Python APIs." },
      { name: "Node.js", detail: "Server-side JavaScript, like this site’s message board." },
      { name: "Java", detail: "Backend coursework, like the Spring Boot bookstore project." },
      { name: "Tailwind CSS", detail: "Styling this site." },
      { name: "Framer Motion", detail: "UI animation in React." },
      { name: "Docker", detail: "Packaging apps to run anywhere." },
      { name: "Git", detail: "Version control for everything I build." },
      { name: "Figma", detail: "UI/UX prototyping before I build." },
    ],
  },
];

const subheading = "font-nav mt-5 mb-2 text-sm font-bold tracking-widest uppercase";

// Your photo already has its ornate frame drawn in; the "Mareline" oval links to LinkedIn
function ProfilePhoto() {
  const [photoLoaded, setPhotoLoaded] = useState(false);

  const photoMissing = (
    <div className="absolute inset-[12%] grid place-items-center border-2 border-dashed border-ink/40 bg-ink/5 p-4 text-center text-xs">
      {import.meta.env.DEV ? "Add your photo as art/photo.png" : "MR"}
    </div>
  );

  const nameTag = "rounded-[50%] border-[3px] border-ink bg-white py-1 text-center font-script text-2xl leading-tight";

  return (
    <Reveal>
      <figure className="photo-sway relative aspect-[4/5] w-full">
        {!photoLoaded && <div className="absolute inset-[12%] animate-pulse bg-ink/10" />}
        <SafeImage
          src={imageUrl("photo")}
          alt="Mareline Ramirez sipping from a mug, inside a hand-drawn floral frame"
          fallback={photoMissing}
          onLoad={() => setPhotoLoaded(true)}
          className="absolute inset-0 h-full w-full object-contain"
        />
        <figcaption className="absolute bottom-[3%] left-1/2 w-1/2 -translate-x-1/2">
          {LINKEDIN_URL ? (
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Find me on LinkedIn"
              className={`${nameTag} block text-ink no-underline transition-transform hover:-rotate-3 hover:scale-105`}
            >
              Mareline
            </a>
          ) : (
            <span className={`${nameTag} block`}>Mareline</span>
          )}
        </figcaption>
      </figure>
      <p className="mt-1 flex -rotate-3 items-center justify-center gap-1 font-hand text-2xl">
        <svg aria-hidden="true" viewBox="0 0 40 30" className="h-7 w-9 fill-none stroke-ink" strokeWidth="2" strokeLinecap="round">
          <path d="M36 26 C 26 25, 12 19, 9 5 M9 5 L3 12 M9 5 L15 10" />
        </svg>
        hi, that’s me! <span className="text-lg opacity-70">(click my name)</span>
      </p>
    </Reveal>
  );
}

// Fills the space under the photo: a taped sticky note of what you're up to right now
function CurrentlyNote() {
  return (
    <Reveal className="taped sketch-border paper-hover relative mx-auto mt-6 w-[88%] rotate-2 bg-card px-5 pt-6 pb-4 shadow-[3px_4px_0_rgba(0,0,0,0.08)]" delay={200}>
      <p className="font-hand text-2xl leading-none">currently…</p>
      <ul className="mt-2 space-y-1 font-hand text-lg leading-snug">
        <li>✎ pursuing my MBA in Business Data Analytics at FIU</li>
        <li>
          ✎ writing “Games I Grew Up On” on{" "}
          <a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2">
            Substack
          </a>
        </li>
        <li>✎ shipping Azure services as a product owner</li>
      </ul>
    </Reveal>
  );
}

// Cat corner under the photo: the cat with her toys and a coffee. Pet her and she moves to a new spot.
const CAT_SPOTS = ["left-1/2", "left-[80%]", "left-[20%]"]; // starts in the middle of her toys

function CatCorner() {
  const [spot, setSpot] = useState(0);
  return (
    <div className="relative mx-auto mt-12 h-40 w-[92%]">
      <YarnBall className="absolute bottom-0 left-0 w-12 -rotate-12" />
      <ToyMouse className="absolute right-0 bottom-0 w-14 rotate-6" />
      <FeatherWand className="absolute top-0 right-[6%] w-24 -rotate-[20deg]" />
      <Cat
        onPet={() => setSpot((s) => (s + 1) % CAT_SPOTS.length)}
        className={`cat-walk absolute bottom-0 w-24 -translate-x-1/2 ${CAT_SPOTS[spot]}`}
      />
    </div>
  );
}

// Toolbox: a strip torn off a note pad. Each tool is a chip; click it to see how I use it.
function Toolbox() {
  const [open, setOpen] = useState(null);
  const boxRef = useRef(null);

  // Close the pop-up on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (event) => !boxRef.current?.contains(event.target) && setOpen(null);
    const onKey = (event) => event.key === "Escape" && setOpen(null);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <Reveal className="notepad paper-hover-art mt-6 px-5 pt-6 pb-4 sm:pl-14 sm:pr-6" delay={150}>
      <div ref={boxRef}>
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-hand text-2xl leading-none">my toolbox</h3>
          <p className="font-hand text-base opacity-65">tap a tool to see how I use it</p>
        </div>
        <div className="mt-2 space-y-2">
          {TOOLBOX.map((group) => (
            <div key={group.label} className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
              <span className="w-full font-nav text-[10px] tracking-widest uppercase opacity-70 sm:w-36">{group.label}</span>
              {group.tools.map((tool) => {
                const isOpen = open === tool.name;
                return (
                  <span key={tool.name} className="relative">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : tool.name)}
                      className={`sketch-border cursor-pointer px-2 font-hand text-base leading-snug transition-colors ${
                        isOpen ? "bg-ink text-white" : "bg-white/70 hover:bg-white"
                      }`}
                    >
                      {tool.name}
                    </button>
                    {isOpen && (
                      <span
                        role="tooltip"
                        className="sketch-border absolute bottom-full left-1/2 z-30 mb-2 block w-64 -translate-x-1/2 max-sm:fixed max-sm:inset-x-4 max-sm:top-auto max-sm:bottom-6 max-sm:mb-0 max-sm:w-auto max-sm:translate-x-0 bg-card px-3 py-2 text-left text-[13px] leading-snug shadow-[3px_4px_0_rgba(0,0,0,0.12)]"
                      >
                        <span className="block font-hand text-lg leading-none">{tool.name}</span>
                        <span className="mt-1 block">{tool.detail}</span>
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export default function About({ onPop }) {
  return (
    <section id="about" className="relative scroll-mt-32">
      <div className="flex items-center gap-5">
        <SectionHeading>About me</SectionHeading>
        <Doodle name="sparkles" onPop={onPop} float depth={4} className="w-12 sm:w-14" />
      </div>

      {/* Phones: photo, bio, toolbox, then the "currently" note. Wider screens: photo + note left; bio + toolbox right. */}
      <div className="relative z-10 mt-6 grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-x-14">
        <div className="mx-auto w-full max-w-[22rem] lg:max-w-[25rem]">
          <ProfilePhoto />
          <div className="hidden md:block">
            <CurrentlyNote />
            <CatCorner />
          </div>
        </div>

        <div>
          {/* Bio inside a hand-drawn double frame, with a lily, a coffee and the cat */}
          <div className="bio-frame paper-hover relative mt-4 px-6 pt-9 pb-8 sm:px-8">
            {/* Top decoration: two swirl stickers holding the paper up, and a little pencil flourish */}
            <Doodle name="spiral" onPop={onPop} depth={2} className="absolute -top-5 left-[6%] z-20 w-11 -rotate-12 drop-shadow-[1px_2px_0_rgba(0,0,0,0.15)]" />
            <Doodle name="spiral" onPop={onPop} depth={2} className="absolute -top-5 right-[14%] z-20 w-11 rotate-12 drop-shadow-[1px_2px_0_rgba(0,0,0,0.15)]" />
            <p aria-hidden="true" className="absolute top-1.5 left-1/2 flex -translate-x-1/2 items-center gap-2 font-hand text-lg whitespace-nowrap opacity-70">
              <svg viewBox="0 0 60 10" className="h-2.5 w-12 fill-none stroke-ink" strokeWidth="1.6" strokeLinecap="round">
                <path d="M2 5 Q 12 1, 22 5 T 42 5 T 58 4" />
              </svg>
              ✦ a little about me ✦
              <svg viewBox="0 0 60 10" className="h-2.5 w-12 -scale-x-100 fill-none stroke-ink" strokeWidth="1.6" strokeLinecap="round">
                <path d="M2 5 Q 12 1, 22 5 T 42 5 T 58 4" />
              </svg>
            </p>
            <Doodle name="liliesDrip" sway depth={-3} className="hang absolute -top-4 -right-8 z-20 w-20 rotate-6 sm:w-24 lg:-right-14 lg:w-28" />

            <Reveal className="text-[14.5px] leading-relaxed" delay={150}>
              <p className="pr-8">
                Hello! I’m a product owner &amp; developer who loves to bridge the gap between complex systems and
                valuable information, and I just love learning!
              </p>

              <h3 className={subheading}>Education</h3>
              <ul className="space-y-0.5">
                <li>★ MBA in Business Data Analytics, Florida International University <em>(in progress)</em></li>
                <li>★ Bachelor’s in Computer Science</li>
                <li>★ Bachelor’s in Liberal Studies (Health Science), double major with Psychology</li>
              </ul>

              <h3 className={subheading}>What I bring</h3>
              <ul className="grid gap-x-8 gap-y-2 xl:grid-cols-2">
                {STRENGTHS.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}:</strong> {item.body}
                  </li>
                ))}
              </ul>

              <div className="grid gap-x-8 xl:grid-cols-2">
                <div>
                  <h3 className={subheading}>Outside of work</h3>
                  <p>
                    I love writing on Substack to explore different topics of interest, like neurodiversity in tech,
                    product strategy, and gaming mechanics. You can also find me advocating for inclusive tech
                    communities.
                  </p>
                </div>
                <div>
                  <h3 className={subheading}>Let’s connect</h3>
                  <p>
                    I’m always up for a good conversation, so please feel free to{" "}
                    <a href="#contact" className="text-ink underline underline-offset-2">connect with me</a>!
                  </p>
                </div>
              </div>
            </Reveal>

            <Coffee className="absolute -right-4 -bottom-6 w-20 rotate-6" />
          </div>

          {/* Toolbox sits under "Let's connect" on every screen size */}
          <Toolbox />

          <div className="md:hidden">
            <CurrentlyNote />
            <CatCorner />
          </div>
        </div>
      </div>
    </section>
  );
}
