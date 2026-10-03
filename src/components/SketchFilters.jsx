// Three slightly different "wobble" filters. Cycling through them (.doodle-boil)
// makes outlines jitter like frames of a hand-drawn animation.
export default function SketchFilters() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        {[3, 11, 27].map((seed, i) => (
          <filter key={seed} id={`boil-${i}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={seed} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        ))}
      </defs>
    </svg>
  );
}
