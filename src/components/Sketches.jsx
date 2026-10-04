// Little ink sketches drawn in code (pencils, pencil marks, a coffee mug) to decorate the sketchbook pages.
// All are decorative: hidden from screen readers and click-through.

const ink = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" };

export function Pencil({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 240 34" className={`pointer-events-none text-ink ${className}`}>
      {/* body */}
      <path d="M40 6 L200 5 L201 29 L40 28 Z" fill="#f3f0e8" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M41 13 L200 12.5 M41 21 L200 21.5" {...ink} strokeWidth="1.2" opacity="0.6" />
      {/* metal band + eraser */}
      <path d="M200 5 L214 5 L214 29 L201 29" fill="#d9d6ce" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M205 5 L205 29 M209 5 L209 29" {...ink} strokeWidth="1.2" />
      <path d="M214 5 Q232 5 232 17 Q232 29 214 29 Z" fill="#c9c8c5" stroke="currentColor" strokeWidth="2.5" />
      {/* sharpened wood + graphite tip */}
      <path d="M40 6 L8 17 L40 28" fill="#e4dfd2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M8 17 L19 13.3 L19 20.7 Z" fill="currentColor" />
      <path d="M40 6 Q34 12 40 17 Q34 22 40 28" {...ink} strokeWidth="1.5" />
    </svg>
  );
}

// A few loose pencil marks: hatching, a squiggle, a little star and a swirl
export function PencilMarks({ variant = 0, className = "" }) {
  const marks = [
    <g key="hatch">
      <path d="M10 60 L40 20 M22 64 L52 24 M34 68 L64 28 M46 72 L76 32" />
    </g>,
    <g key="squiggle">
      <path d="M6 40 C 20 10, 34 70, 48 40 S 76 10, 90 40 S 118 70, 132 40" />
    </g>,
    <g key="star">
      <path d="M40 8 L48 32 L72 34 L52 48 L60 72 L40 58 L20 72 L28 48 L8 34 L32 32 Z" />
    </g>,
    <g key="swirl">
      <path d="M50 44 C 50 34, 64 34, 64 46 C 64 60, 40 62, 36 46 C 32 28, 62 20, 74 36 C 86 54, 66 78, 42 74" />
    </g>,
  ];
  return (
    <svg aria-hidden="true" viewBox="0 0 140 80" className={`pointer-events-none text-ink ${className}`} {...ink} strokeWidth="2.2" opacity="0.55">
      {marks[variant % marks.length]}
    </svg>
  );
}

// A hand-drawn curved arrow, for "look here" notes
export function SketchArrow({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 80 50" className={`pointer-events-none text-ink ${className}`} {...ink} strokeWidth="2.2">
      <path d="M6 8 C 20 40, 46 46, 70 30" />
      <path d="M70 30 L58 28 M70 30 L64 41" />
    </svg>
  );
}

// Mug of coffee with steam that gently rises
export function Coffee({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 110 110" className={`pointer-events-none text-ink ${className}`}>
      <g className="coffee-steam" {...ink} strokeWidth="2">
        <path d="M42 34 C 36 26, 48 20, 42 10" />
        <path d="M56 32 C 50 22, 62 18, 56 6" />
        <path d="M70 34 C 64 26, 76 20, 70 12" />
      </g>
      {/* saucer */}
      <path d="M12 96 Q55 108 98 96 Q55 88 12 96 Z" fill="#e4dfd2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      {/* handle */}
      <path d="M82 54 C 102 52, 102 78, 80 78" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* cup */}
      <path d="M26 44 L84 44 L80 86 Q55 96 30 86 Z" fill="#f3f0e8" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="55" cy="44" rx="29" ry="6" fill="#4a4a4a" stroke="currentColor" strokeWidth="2.5" />
      {/* little heart on the cup */}
      <path d="M55 74 C 46 66, 48 58, 55 63 C 62 58, 64 66, 55 74 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

// Cat toys for the cat corner
export function YarnBall({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 80 70" className={`pointer-events-none text-ink ${className}`}>
      <circle cx="34" cy="38" r="26" fill="#d9d6ce" stroke="currentColor" strokeWidth="2.5" />
      <g {...ink} strokeWidth="1.6">
        <path d="M12 28 C 26 34, 44 22, 58 30" />
        <path d="M10 42 C 26 48, 46 34, 60 44" />
        <path d="M18 58 C 30 52, 44 56, 52 60" />
        <path d="M22 16 C 28 30, 26 48, 36 63" />
        <path d="M40 13 C 46 28, 48 46, 44 64" />
      </g>
      <path d="M58 52 C 66 58, 70 50, 76 58 S 80 66, 74 68" {...ink} strokeWidth="2" />
    </svg>
  );
}

export function ToyMouse({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 90 50" className={`pointer-events-none text-ink ${className}`}>
      <path d="M8 34 C 2 30, 2 24, 10 22" {...ink} strokeWidth="2" />
      <path d="M10 40 C 12 22, 34 12, 56 20 C 66 24, 74 30, 80 36 L 72 40 Z" fill="#c9c8c5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="52" cy="17" r="7" fill="#f3f0e8" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="68" cy="31" r="1.8" fill="currentColor" />
      <path d="M10 40 L 74 40" {...ink} strokeWidth="2.5" />
    </svg>
  );
}

export function FeatherWand({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 40" className={`pointer-events-none text-ink ${className}`}>
      <path d="M4 20 L 70 20" {...ink} strokeWidth="2.5" />
      <path d="M70 20 C 74 12, 78 26, 82 20" {...ink} strokeWidth="1.6" />
      <path d="M82 20 C 92 6, 112 8, 116 18 C 108 30, 92 32, 82 20 Z" fill="#d9d6ce" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M86 20 L 112 17 M92 14 L 98 19 M100 12 L 104 18 M94 26 L 99 21 M103 26 L 106 20" {...ink} strokeWidth="1.2" />
    </svg>
  );
}
