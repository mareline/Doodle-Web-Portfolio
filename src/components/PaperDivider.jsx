import { useEffect, useRef } from "react";

// A scrap of notebook paper, ripped on every side, with a note written in pencil. As you scroll on to the
// next page, an eraser sweeps across and rubs the writing away. It's plain HTML/CSS driven by one cheap
// scroll listener (no 3D), so it stays smooth even when scrolling fast.
export default function PaperDivider({ label }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let onScreen = false;
    const update = () => {
      const box = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 while the strip rests near the bottom of the screen, 1 once it has moved up to ~40% of the screen
      const progress = Math.min(1, Math.max(0, (0.86 * vh - (box.top + box.height / 2)) / (0.46 * vh)));
      el.style.setProperty("--erase", progress.toFixed(3));
    };
    const onScroll = () => {
      if (!onScreen) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
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
      <div className="torn-paper relative grid aspect-[5.5] w-[min(80%,560px)] place-items-center">
        <p className="pencil-text font-hand text-[clamp(1.2rem,2.6vw,2rem)]">{label}</p>
        <span className="eraser" />
      </div>
    </div>
  );
}
