import Reveal from "./Reveal";

// Big wide heading with a hand-drawn underline that draws itself in on scroll.
export default function SectionHeading({ children, className = "" }) {
  return (
    <Reveal
      as="h2"
      className={`relative inline-block font-display text-wide text-[clamp(1.6rem,4.5vw,2.5rem)] leading-none font-black uppercase ${className}`}
    >
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        className="ink-line scribble absolute -bottom-3 left-[-2%] h-3 w-[104%]"
      >
        <path pathLength="1" d="M3 8 C 40 2, 72 11, 110 6 S 168 2, 197 7" />
      </svg>
    </Reveal>
  );
}
