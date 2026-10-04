import { useEffect, useRef, useState } from "react";

const SOUNDS = [
  "mrrp! ♡",
  "meow!",
  "purrr…",
  "*headbump*",
  "hi friend!",
  "play with me!",
  "is that coffee for me?",
  ":3 meow!!!",
  "pspsps? yes?",
  "feed me :3",
];
const MOODS = ["happy", "surprised", "sleepy", "wink"];
const PUPIL_RANGE = 2.6; // how far the pupils can look around, in drawing units

// A sketched cat whose eyes follow your cursor. Click (or press Enter) to pet it: she says something,
// pulls a face (happy, surprised, sleepy or a wink) and tells the parent via onPet so she can move around.
export default function Cat({ className = "", onPet }) {
  const svgRef = useRef(null);
  const leftPupil = useRef(null);
  const rightPupil = useRef(null);
  const [sound, setSound] = useState(null);
  const [mood, setMood] = useState(null);
  const timer = useRef(0);

  // Eyes follow the pointer
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onMove = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const svg = svgRef.current;
        if (!svg) return;
        const box = svg.getBoundingClientRect();
        const dx = event.clientX - (box.left + box.width / 2);
        const dy = event.clientY - (box.top + box.height * 0.35);
        const distance = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, distance / 200) * PUPIL_RANGE;
        const transform = `translate(${((dx / distance) * reach).toFixed(2)} ${((dy / distance) * reach).toFixed(2)})`;
        leftPupil.current?.setAttribute("transform", transform);
        rightPupil.current?.setAttribute("transform", transform);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  function pet() {
    clearTimeout(timer.current);
    setSound(SOUNDS[Math.floor(Math.random() * SOUNDS.length)]);
    setMood(MOODS[Math.floor(Math.random() * MOODS.length)]);
    onPet?.();
    timer.current = setTimeout(() => {
      setSound(null);
      setMood(null);
    }, 1800);
  }

  // className positions the cat (e.g. absolute in a corner); the button inside anchors the speech bubble
  return (
    <span className={`block ${className}`}>
      <button
        type="button"
        onClick={pet}
        aria-label="Pet the cat"
        className={`cat group relative block w-full cursor-pointer bg-transparent p-0 ${sound ? "cat-happy" : ""}`}
      >
        {sound && (
          <span
            role="status"
            className="speech-bubble cat-bubble absolute -top-14 left-1/2 z-10 -translate-x-1/2 bg-card px-3 py-1 font-hand text-lg whitespace-nowrap"
          >
            {sound}
          </span>
        )}
        <svg
          ref={svgRef}
          viewBox="0 0 140 130"
          className="h-auto w-full text-ink"
          aria-hidden="true"
        >
          {/* tail */}
          <path
            className="cat-tail"
            d="M98 118 C 128 118, 134 92, 122 76 C 114 66, 104 72, 110 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* body */}
          <path
            d="M44 124 C 30 124, 30 86, 48 68 L 92 68 C 110 86, 110 124, 96 124 Z"
            fill="#f3f0e8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* front paws */}
          <path
            d="M58 124 C 56 116, 66 114, 66 124 M74 124 C 74 114, 84 116, 82 124"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* head with ears */}
          <path
            d="M36 52 L 40 14 L 58 32 Q 70 28 82 32 L 100 14 L 104 52 C 104 70, 88 78, 70 78 C 52 78, 36 70, 36 52 Z"
            fill="#f3f0e8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M44 24 L 46 36 M96 24 L 94 36"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* eyes: follow the cursor normally, or pull a face after being petted */}
          {mood === "happy" && (
            <path
              d="M49 52 Q 56 43 63 52 M77 52 Q 84 43 91 52"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          )}
          {mood === "sleepy" && (
            <path
              d="M49 50 Q 56 56 63 50 M77 50 Q 84 56 91 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          )}
          {mood === "wink" && (
            <>
              <ellipse
                cx="56"
                cy="50"
                rx="7"
                ry="8"
                fill="#fff"
                stroke="currentColor"
                strokeWidth="2.2"
              />
              <circle cx="56" cy="51" r="3.6" fill="currentColor" />
              <path
                d="M77 51 Q 84 45 91 51"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </>
          )}
          {mood === "surprised" && (
            <>
              <circle
                cx="56"
                cy="50"
                r="9"
                fill="#fff"
                stroke="currentColor"
                strokeWidth="2.2"
              />
              <circle
                cx="84"
                cy="50"
                r="9"
                fill="#fff"
                stroke="currentColor"
                strokeWidth="2.2"
              />
              <circle cx="56" cy="50" r="2.2" fill="currentColor" />
              <circle cx="84" cy="50" r="2.2" fill="currentColor" />
            </>
          )}
          <g
            className="cat-eyes"
            style={{ display: mood ? "none" : undefined }}
          >
            <ellipse
              cx="56"
              cy="50"
              rx="7"
              ry="8"
              fill="#fff"
              stroke="currentColor"
              strokeWidth="2.2"
            />
            <ellipse
              cx="84"
              cy="50"
              rx="7"
              ry="8"
              fill="#fff"
              stroke="currentColor"
              strokeWidth="2.2"
            />
            <circle
              ref={leftPupil}
              cx="56"
              cy="51"
              r="3.6"
              fill="currentColor"
            />
            <circle
              ref={rightPupil}
              cx="84"
              cy="51"
              r="3.6"
              fill="currentColor"
            />
          </g>
          {(mood === "happy" || mood === "wink") && (
            <path
              d="M44 60 Q 48 58 52 60 M88 60 Q 92 58 96 60"
              fill="none"
              stroke="#c26d8a"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.7"
            />
          )}
          {/* nose, mouth, whiskers, blush */}
          <path d="M67 60 L 73 60 L 70 64 Z" fill="currentColor" />
          {mood === "surprised" ? (
            <ellipse
              cx="70"
              cy="69"
              rx="3.5"
              ry="4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          ) : (
            <path
              d="M70 64 Q 66 70 62 66 M70 64 Q 74 70 78 66"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
          <path
            d="M46 62 L 26 58 M46 66 L 26 68 M94 62 L 114 58 M94 66 L 114 68"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M46 58 Q 49 56 52 58 M88 58 Q 91 56 94 58"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </button>
    </span>
  );
}
