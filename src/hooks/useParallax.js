import { useEffect } from "react";

// Feeds the cursor position (-1…1) into --px/--py on the stage, so `.parallax` doodles drift like layered paper.
export function useParallax(stageRef) {
  useEffect(() => {
    const stage = stageRef.current;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!stage || !canHover || reduceMotion) return;

    let frame = 0;
    const onMove = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        stage.style.setProperty("--px", ((event.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        stage.style.setProperty("--py", ((event.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [stageRef]);
}
