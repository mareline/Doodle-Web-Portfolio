// A torn notebook-paper strip between pages. While it's flat it's ordinary page content, so it scrolls in perfect
// step with the page; <PaperLayer> swaps in a 3D copy only once it starts crumpling (data-crumpling is set then).
export default function PaperDivider({ label }) {
  return (
    <div data-paper-divider={label} aria-hidden="true" className="grid h-[clamp(120px,18vw,180px)] place-items-center lg:h-[136px]">
      <p className="divider-paper notepad grid aspect-[5.5] w-[min(80%,560px)] place-items-center pt-1 font-hand text-[clamp(1.2rem,2.6vw,2rem)]">
        {label}
      </p>
    </div>
  );
}
