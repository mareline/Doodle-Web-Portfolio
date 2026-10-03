// A taped-on handwritten note, used for empty states and little asides.
export default function Note({ children, className = "" }) {
  return (
    <div
      className={`taped sketch-border relative mx-auto max-w-md -rotate-1 bg-card px-6 pt-7 pb-5 text-center font-hand text-2xl leading-snug shadow-[3px_4px_0_rgba(0,0,0,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}
