import { useState } from "react";
import Doodle from "./Doodle";
import Reveal from "./Reveal";
import SafeImage from "./SafeImage";
import SectionHeading from "./SectionHeading";
import { imageUrl } from "../data/images";

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

const TOOLBOX = [
  "Jira", "Confluence", "JQL", "Excel", "SAFe", "Azure", "React", "Three.js", "Python", "JavaScript", "Java", "SQL",
  "Node.js", "FastAPI", "Tailwind CSS", "Framer Motion", "Docker", "Git", "Figma", "English & Spanish",
];
const STICKER_TILTS = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "rotate-1", "-rotate-2"];

const subheading = "font-nav mt-6 mb-2 text-xs tracking-widest uppercase";

function ProfilePhoto() {
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [hasFrame, setHasFrame] = useState(true);

  const photoMissing = (
    <div className="absolute inset-[12%] grid place-items-center border-2 border-dashed border-ink/40 bg-ink/5 p-4 text-center text-xs">
      {import.meta.env.DEV ? "Add your headshot as public/images/photo.jpg" : "MR"}
    </div>
  );

  return (
    <Reveal>
      <figure className="relative aspect-[3/4] w-full">
        {!photoLoaded && <div className="absolute inset-[12%] animate-pulse bg-ink/10" />}
        <SafeImage
          src={imageUrl("photo")}
          alt="Portrait of Mareline Ramirez"
          fallback={photoMissing}
          onLoad={() => setPhotoLoaded(true)}
          className={`absolute inset-[12%] h-[76%] w-[76%] object-cover ${hasFrame ? "" : "sketch-border"}`}
        />
        <SafeImage
          src={imageUrl("frame")}
          aria-hidden="true"
          onError={() => setHasFrame(false)}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        />
        <figcaption className="absolute bottom-[3%] left-1/2 w-1/2 -translate-x-1/2 rounded-[50%] border-[3px] border-ink bg-white py-1 text-center font-script text-2xl leading-tight">
          Mareline
        </figcaption>
      </figure>
      <p className="mt-2 flex -rotate-3 items-center justify-center gap-1 font-hand text-2xl">
        <svg aria-hidden="true" viewBox="0 0 40 30" className="h-7 w-9 fill-none stroke-ink" strokeWidth="2" strokeLinecap="round">
          <path d="M36 26 C 26 25, 12 19, 9 5 M9 5 L3 12 M9 5 L15 10" />
        </svg>
        hi, that’s me!
      </p>
    </Reveal>
  );
}

// Sticker-style skills, under the photo
function Toolbox() {
  return (
    <Reveal className="mt-8" delay={150}>
      <h3 className={`${subheading} text-center`}>My toolbox</h3>
      <ul className="flex flex-wrap justify-center gap-2.5 pt-1">
        {TOOLBOX.map((tool, i) => (
          <li
            key={tool}
            className={`sketch-border bg-card px-3 py-0.5 font-hand text-xl transition-transform hover:-translate-y-1 hover:rotate-0 ${
              STICKER_TILTS[i % STICKER_TILTS.length]
            }`}
          >
            {tool}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export default function About({ onPop }) {
  return (
    <section id="about" className="relative scroll-mt-6 pt-10">
      <div className="relative z-10 grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="mx-auto w-full max-w-72">
          <ProfilePhoto />
          <Toolbox />
        </div>

        <div>
          <div className="relative flex items-center gap-4">
            <Doodle name="sparkles" onPop={onPop} float boil depth={8} className="w-12 sm:w-16" />
            <SectionHeading>About me</SectionHeading>
            <Doodle name="spiral" onPop={onPop} boil depth={-6} className="ml-auto w-9 sm:w-11" />
          </div>

          <Reveal className="mt-8 text-[15px] leading-relaxed" delay={150}>
            <p>
              Hello! I’m a product owner &amp; developer who loves to bridge the gap between complex systems and
              valuable information! I currently hold a B.A. in Computer Science and I’m pursuing an MBA in Business
              Data Analytics from Florida International University.
            </p>

            <h3 className={subheading}>What I bring</h3>
            <ul className="space-y-2">
              {STRENGTHS.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}:</strong> {item.body}
                </li>
              ))}
            </ul>

            <h3 className={subheading}>Outside of work</h3>
            <p>
              I love writing on Substack to explore different topics of interest. Some of them include exploring
              neurodiversity in tech, product strategy, and gaming mechanics. You can also find me advocating for
              inclusive tech communities.
            </p>

            <h3 className={subheading}>Let’s connect</h3>
            <p>
              I’m always up for a good conversation, so please feel free to{" "}
              <a href="#contact" className="text-ink underline underline-offset-2">connect with me</a>!
            </p>
          </Reveal>
        </div>
      </div>

      {/* Lily corner + handwriting, as in the mockup */}
      <div className="relative mt-6">
        <Doodle name="handwriting" depth={4} className="absolute top-0 left-[18%] z-0 w-[55%] opacity-40" />
        <Doodle name="flower" onPop={onPop} depth={-12} className="absolute -top-4 right-[3%] z-10 w-[16%] max-w-36" />
        <Doodle name="lilies" sway className="relative z-10 block w-[92%]" />
      </div>
    </section>
  );
}
