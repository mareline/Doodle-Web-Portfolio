import Doodle from "./Doodle";
import InkLink from "./InkLink";

const linkClass = "justify-self-center font-nav text-[clamp(0.6rem,1.7vw,0.95rem)] tracking-wider uppercase";

export default function Nav({ onPop }) {
  return (
    <nav aria-label="Main" className="relative z-20 grid grid-cols-5 items-center pt-6 text-center">
      <InkLink href="#about" className={linkClass}>About</InkLink>
      <InkLink href="#work" className={linkClass}>Work</InkLink>
      <Doodle name="butterfly" onPop={onPop} float boil depth={6} className="mx-auto w-14 sm:w-20" />
      <InkLink href="#portfolio" className={linkClass}>Portfolio</InkLink>
      <InkLink href="#contact" className={linkClass}>Contact</InkLink>
    </nav>
  );
}
