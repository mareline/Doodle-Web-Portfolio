import { useEffect, useState } from "react";
import Doodle from "./Doodle";
import InkLink from "./InkLink";

const linkClass =
  "justify-self-center font-nav text-[clamp(0.6rem,1.7vw,1.15rem)] tracking-wider uppercase lg:text-xl lg:tracking-widest";

// Shown on the title page. Once you scroll into About me it slides away so the pages have the screen to
// themselves; scrolling back up (or tabbing to it with the keyboard) brings it back.
export default function Nav({ onPop }) {
  const [hidden, setHidden] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      const y = window.scrollY;
      const pastHome = y > window.innerHeight * 0.6;
      const scrollingUp = y < lastY - 4;
      if (!pastHome || scrollingUp) setHidden(false);
      else if (y > lastY + 4) setHidden(true);
      lastY = y;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const tucked = hidden && !focused;

  return (
    <div
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`fixed inset-x-0 top-0 z-40 transition-[translate,opacity] duration-500 ease-out ${
        tucked ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      {/* Soft frosted strip behind the links, fading out at the bottom edge */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-paper/45 backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]"
      />
      <nav
        aria-label="Main"
        className="relative mx-auto grid h-[var(--nav-h)] max-w-[1360px] grid-cols-5 items-center px-5 text-center sm:px-10"
      >
        <InkLink href="#about" className={linkClass}>About</InkLink>
        <InkLink href="#work" className={linkClass}>Work</InkLink>
        <Doodle name="butterfly" onPop={onPop} float depth={3} className="mx-auto w-14 sm:w-20 lg:w-28" />
        <InkLink href="#portfolio" className={linkClass}>Portfolio</InkLink>
        <InkLink href="#contact" className={linkClass}>Contact</InkLink>
      </nav>
    </div>
  );
}
