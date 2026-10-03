const RAYS = 8;

export default function Sparkles({ bursts }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {bursts.map((burst) => (
        <span key={burst.id} className="absolute" style={{ left: burst.x, top: burst.y }}>
          {Array.from({ length: RAYS }, (_, i) => (
            <span key={i} className="sparkle" style={{ "--angle": `${(360 / RAYS) * i}deg` }}>
              ✦
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
