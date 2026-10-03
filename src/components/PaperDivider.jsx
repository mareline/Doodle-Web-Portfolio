// A spot between sections where a torn paper strip sits; <PaperLayer> crumples it as you scroll.
// The dashed "cut here" line is what shows when the 3D version isn't running.
export default function PaperDivider({ label }) {
  return (
    <div data-paper-divider={label} aria-hidden="true" className="grid h-[clamp(120px,18vw,180px)] place-items-center">
      <p className="divider-fallback flex -rotate-1 items-center gap-3 font-hand text-2xl opacity-80">
        <span>✂</span>
        <span className="border-b-2 border-dashed border-ink/50 px-6 pb-1">{label}</span>
      </p>
    </div>
  );
}
