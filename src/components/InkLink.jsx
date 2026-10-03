// A link that gets a hand-drawn squiggle underline on hover/focus.
export default function InkLink({ href, className = "", children, external = false }) {
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a href={href} className={`relative inline-block text-ink no-underline ${className}`} {...externalProps}>
      {children}
      <svg aria-hidden="true" viewBox="0 0 100 8" preserveAspectRatio="none" className="ink-line squiggle absolute -bottom-2 left-0 h-2 w-full">
        <path pathLength="1" d="M1 5 Q 12 1, 25 4 T 50 4 T 75 4 T 99 3" />
      </svg>
    </a>
  );
}
