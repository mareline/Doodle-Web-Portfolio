import { useCallback, useEffect, useRef, useState } from "react";

const BURST_MS = 700;
const MAX_BURSTS = 6; // caps how many bursts render at once, however fast someone clicks

export function useSparkles(stageRef) {
  const [bursts, setBursts] = useState([]);
  const nextId = useRef(0);
  const timers = useRef(new Set());

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const handlePop = useCallback(
    (event) => {
      const stage = stageRef.current;
      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      const id = nextId.current++;
      setBursts((current) => [
        ...current.slice(-(MAX_BURSTS - 1)),
        { id, x: event.clientX - rect.left, y: event.clientY - rect.top },
      ]);

      const timer = setTimeout(() => {
        setBursts((current) => current.filter((burst) => burst.id !== id));
        timers.current.delete(timer);
      }, BURST_MS);
      timers.current.add(timer);
    },
    [stageRef]
  );

  return { bursts, handlePop };
}
