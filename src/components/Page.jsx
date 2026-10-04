import PaperDivider from "./PaperDivider";

// One full-screen "page" on desktop (see .page in index.css). Every page puts its content in the same centred
// column, so headings and edges line up from page to page. The optional torn-paper note at the bottom crumples
// and rolls away as you scroll on to the next page. `wide` gives a page (the title page) more room.
export default function Page({ divider, wide = false, children }) {
  return (
    <div className="page flex flex-col">
      <div className={`mx-auto flex w-full ${wide ? "max-w-[1600px]" : "max-w-[1280px]"} flex-1 flex-col justify-center py-10 lg:py-8`}>
        {children}
      </div>
      {divider && <PaperDivider label={divider} />}
    </div>
  );
}
