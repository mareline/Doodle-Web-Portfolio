import { useEffect, useRef } from "react";


export default function PaperDivider({ label }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let onScreen = false;
    let shown = 0; // what the eraser currently shows
    let target = 0; // where the scroll position says it should be

    
    const step = () => {
      const diff = target - shown;
      // scrolling on: an eraser rubs the note out · scrolling back up: a pencil writes it back in
      const tool = diff < 0 ? "pencil" : "eraser";
      if (el.dataset.tool !== tool) el.dataset.tool = tool;
      shown = Math.abs(diff) < 0.004 ? target : shown + Math.sign(diff) * Math.min(Math.abs(diff), 0.014 + Math.abs(diff) * 0.04);
      el.style.setProperty("--erase", shown.toFixed(3));
      frame = shown === target ? 0 : requestAnimationFrame(step);
    };
    const update = () => {
      const box = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Stays fully written while it is in the lower half of the screen (so it can always be read),
      // then is erased as it travels from the middle of the screen to the top.
      target = Math.min(1, Math.max(0, (0.5 * vh - (box.top + box.height / 2)) / (0.45 * vh)));
      cancelAnimationFrame(frame); // never wait on a stale frame request
      frame = requestAnimationFrame(step);
    };
    const onScroll = () => {
      if (onScreen) update();
    };
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) update();
    });
    observer.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="erase-strip grid h-[clamp(120px,18vw,180px)] place-items-center lg:h-[136px]">
      <div className="torn-paper relative grid w-fit max-w-[92%] min-w-[min(80%,420px)] place-items-center px-14 py-5">
        <p className="pencil-text text-center font-hand text-[clamp(1.15rem,2.4vw,1.9rem)] leading-tight">{label}</p>
        <span className="eraser" />
        <svg className="pencil-tool" viewBox="0 0 100 20">
          <path d="M3 10 L22 2 H90 V18 H22 Z" fill="#fff" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M22 2 V18 M80 2 V18" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
          <path d="M3 10 L10 7 V13 Z" fill="#1a1a1a" />
        </svg>
      </div>
    </div>
  );
}
