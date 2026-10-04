import { useCallback, useEffect, useRef, useState } from "react";
import { imageUrl } from "../data/images";

// Sideways-scrolling area with a hand-drawn scrollbar: a wiggly pencil track and your newspaper star you can drag
// (or click anywhere on the track to jump). Only appears when the content is wider than the screen.
export default function DoodleScroller({ children, className = "" }) {
  const areaRef = useRef(null);
  const trackRef = useRef(null);
  const [state, setState] = useState({ overflow: false, progress: 0 });

  const measure = useCallback(() => {
    const el = areaRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setState({ overflow: max > 4, progress: max > 0 ? el.scrollLeft / max : 0 });
  }, []);

  useEffect(() => {
    const el = areaRef.current;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

  const scrollToPointer = (clientX) => {
    const el = areaRef.current;
    const box = trackRef.current.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (clientX - box.left) / box.width));
    el.scrollLeft = fraction * (el.scrollWidth - el.clientWidth);
  };

  const onPointerDown = (event) => {
    event.preventDefault();
    trackRef.current.setPointerCapture(event.pointerId);
    scrollToPointer(event.clientX);
  };
  const onPointerMove = (event) => {
    if (trackRef.current.hasPointerCapture(event.pointerId)) scrollToPointer(event.clientX);
  };
  const onKeyDown = (event) => {
    const el = areaRef.current;
    if (event.key === "ArrowRight") el.scrollBy({ left: 240, behavior: "smooth" });
    if (event.key === "ArrowLeft") el.scrollBy({ left: -240, behavior: "smooth" });
  };

  return (
    <div className={className}>
      <div ref={areaRef} className="no-scrollbar overflow-x-auto">
        {children}
      </div>

      {state.overflow && (
        <div
          ref={trackRef}
          role="scrollbar"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(state.progress * 100)}
          aria-label="Scroll sideways"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onKeyDown={onKeyDown}
          className="relative mx-auto mt-3 h-8 w-[85%] max-w-md cursor-pointer touch-none"
        >
          {/* wiggly pencil track with little end ticks */}
          <svg aria-hidden="true" viewBox="0 0 300 20" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-ink">
            <path
              d="M4 10 C 24 4, 40 16, 60 10 S 100 4, 120 10 S 160 16, 180 10 S 220 4, 240 10 S 280 16, 296 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="7 5"
              vectorEffect="non-scaling-stroke"
            />
            <path d="M4 4 L4 16 M296 4 L296 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {/* the handle: your newspaper star, spinning as it rolls along */}
          <img
            src={imageUrl("paperStar")}
            alt=""
            draggable={false}
            className="pointer-events-none absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[1px_2px_0_rgba(0,0,0,0.15)]"
            style={{ left: `${state.progress * 100}%`, rotate: `${state.progress * 360}deg` }}
          />
          <span className="absolute right-0 -bottom-5 font-hand text-base whitespace-nowrap opacity-60">drag me →</span>
        </div>
      )}
    </div>
  );
}
