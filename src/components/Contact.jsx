import InkLink from "./InkLink";
import Reveal from "./Reveal";
import SayHi from "./SayHi";
import SectionHeading from "./SectionHeading";
import { SITE } from "../data/site";

export default function Contact() {
  const links = SITE.links.filter((link) => link.href);

  return (
    <section id="contact" className="scroll-mt-6 py-14">
      <SectionHeading>Contact</SectionHeading>

      <SayHi>
        <Reveal>
          <p className="-rotate-1 font-hand text-3xl leading-tight">I’d love to hear from you!</p>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed">
            Feel free to reach out or leave a little note on the wall.
          </p>
          {SITE.email && (
            <p className="mt-5 text-lg">
              <InkLink href={`mailto:${SITE.email}`}>{SITE.email}</InkLink>
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

      <p className="mt-16 font-hand text-lg opacity-70">made with love on {new Date().getFullYear()} Mareline Ramirez</p>
    </section>
  );
}
