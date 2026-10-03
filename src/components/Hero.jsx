import Doodle from "./Doodle";

export default function Hero({ onPop }) {
  return (
    <header className="relative pt-10 pb-24 sm:pt-14 sm:pb-32">
      <Doodle name="paperStar" depth={-10} className="absolute top-[38%] left-[3%] z-0 w-[21%] max-w-48 -rotate-6" />
      <Doodle name="stars" onPop={onPop} float boil depth={16} className="absolute top-[12%] right-[9%] z-0 w-[14%] max-w-28" />
      <Doodle name="figure" onPop={onPop} boil depth={9} className="absolute top-[46%] right-[6%] z-0 w-[19%] max-w-44" />

      <div className="relative z-10 mx-auto w-[74%]">
        <div className="flex items-end gap-3">
          <span className="write-on font-script text-[clamp(1.6rem,5.5vw,3.4rem)] leading-none whitespace-nowrap">
            Mareline Ramirez
          </span>
          <span className="draw-line mb-[0.7em] h-0.5 flex-1 bg-ink [animation-delay:1.2s]" />
        </div>
        <h1 className="font-display text-wide -mt-1 text-[clamp(2.2rem,9.5vw,6rem)] leading-[0.95] font-black uppercase">
          Portfolio
          <span className="sr-only"> — Product Management</span>
        </h1>
        <span className="draw-line mt-3 ml-[8%] block h-0.5 w-[92%] bg-ink [animation-delay:1.5s]" />
        </div>
        </p>
    </header>
  );
}
