import Doodle from "./Doodle";
import TalkingFigure from "./TalkingFigure";

// Big title page. The title block is centred on the page, and every doodle is pinned to the title itself,
// so the whole composition stays balanced at any screen size. The girl sits on top of the title like a sticker.
export default function Hero({ onPop }) {
  return (
    <header className="relative flex justify-center py-14 sm:py-20 lg:py-24">
      <div className="relative w-fit">
        <Doodle name="paperStar" priority depth={-5} className="absolute top-[18%] -left-[20%] z-20 w-[32%] -rotate-6" />
        <Doodle name="stars" priority onPop={onPop} float depth={8} className="absolute -top-[48%] right-[2%] z-0 w-[16%]" />

        <div className="relative z-10">
          <div className="flex items-end gap-3 text-[clamp(1.6rem,4.8vw,6rem)]">
            <span className="write-on font-script text-[clamp(1.6rem,4.8vw,6rem)] leading-none whitespace-nowrap">
              Mareline Ramirez
            </span>
            <span className="draw-line mb-[0.42em] h-0.5 flex-1 bg-ink [animation-delay:1.2s]" />
          </div>
          <h1 className="font-display text-wide -mt-1 text-[clamp(2.2rem,8.6vw,10.5rem)] leading-[0.95] font-black whitespace-nowrap uppercase">
            Portfolio
            <span className="sr-only"> — Product Management</span>
          </h1>
          <span className="draw-line mt-3 ml-[8%] block h-0.5 w-[92%] bg-ink [animation-delay:1.5s]" />
        </div>

        {/* On top of the title's last letters */}
        <TalkingFigure onPop={onPop} className="absolute top-[28%] -right-[16%] z-20 w-[24%]" />
      </div>
    </header>
  );
}
