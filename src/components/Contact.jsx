import InkLink from "./InkLink";
import Reveal from "./Reveal";
import SayHi from "./SayHi";
import SectionHeading from "./SectionHeading";
import { SITE } from "../data/site";

export default function Contact() {
  const links = SITE.links.filter((link) => link.href);

  return (
    <section id="contact" className="scroll-mt-32">
      <SectionHeading>Contact</SectionHeading>

      <SayHi>
        <Reveal>
          <p className="-rotate-1 font-hand text-3xl leading-tight">I’d love to hear from you!</p>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed xl:text-[17px]">
            Feel free to reach out or leave a little note on the wall.
          </p>
          {SITE.emailParts && (
            <p className="mt-5 text-lg">
              <a
                href="#contact"
                onClick={(event) => {
                  event.preventDefault();
                  window.location.href = `mailto:${SITE.emailParts.join("@")}`;
                }}
                title="Opens your email app"
                className="sketch-border inline-flex items-center gap-2 bg-card px-4 py-1.5 text-ink no-underline shadow-[2px_3px_0_rgba(0,0,0,0.08)] transition-transform hover:-translate-y-0.5 hover:-rotate-1"
              >
                <span aria-hidden="true">✉︎</span>
                email me
              </a>
            </p>
          )}
          {links.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-6">
              {links.map((link) => (
                <li key={link.label}>
                  <InkLink href={link.href} external className="font-nav text-xs tracking-widest uppercase">
                    {link.label}
                  </InkLink>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </SayHi>

      <footer className="mt-12 text-center">
        <p className="font-hand text-lg opacity-70">
          made with love ♡ 
        </p>
      </footer>
    </section>
  );
}
