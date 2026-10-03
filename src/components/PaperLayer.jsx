import { useEffect, useRef } from "react";

// Draws the crumpling paper strips for every <PaperDivider> on the page.
// Three.js (~130 KB gzipped) is fetched only after the page has finished loading, and never for visitors who
// prefer reduced motion. Until it's ready, or if WebGL isn't available, each divider shows a simple "cut here" line.
export default function PaperLayer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let scene;
    let cancelled = false;
    const root = document.documentElement;
    const whenIdle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1200));
    const cancelIdle = window.cancelIdleCallback ?? clearTimeout;

    const handle = whenIdle(() => {
      import("../three/paperDividers")
        .then(({ createPaperDividers }) => {
          const dividers = [...document.querySelectorAll("[data-paper-divider]")];
          if (cancelled || !canvasRef.current || dividers.length === 0) return;
          scene = createPaperDividers(canvasRef.current, dividers);
          root.classList.add("paper-3d");
        })
        .catch((error) => console.warn("Paper dividers fell back to plain lines:", error));
    });

    return () => {
      cancelled = true;
      cancelIdle(handle);
      scene?.dispose();
      root.classList.remove("paper-3d");
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 h-full w-full" />;
}
