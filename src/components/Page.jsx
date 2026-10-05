import PaperDivider from "./PaperDivider";

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
