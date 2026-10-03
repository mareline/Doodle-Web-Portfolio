import SafeImage from "./SafeImage";
import { IMAGE_FILES, imageUrl } from "../data/images";

// A decorative illustration.
// className positions/sizes it · onPop: sparkle burst on click
// float / boil / sway: idle motion · depth: how many px it drifts with the cursor (negative = opposite way)
export default function Doodle({ name, className = "", onPop, float = false, boil = false, sway = false, depth = 0 }) {
  const motion = [float && "doodle-float", boil && "doodle-boil", sway && "doodle-sway"].filter(Boolean).join(" ");
  const missing = import.meta.env.DEV ? <span className="doodle-missing">{IMAGE_FILES[name]}</span> : null;

  return (
    <span aria-hidden="true" className={`parallax block ${className}`} style={depth ? { "--depth": depth } : undefined}>
      <SafeImage
        src={imageUrl(name)}
        fallback={missing}
        onClick={onPop}
        className={`block h-auto w-full select-none ${onPop ? "doodle-pop cursor-pointer" : "pointer-events-none"} ${motion}`}
      />
    </span>
  );
}
