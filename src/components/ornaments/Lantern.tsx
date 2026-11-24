import { useId } from "react";

/** A paper sky lantern with a small flame inside. */
export function Lantern({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 60 84" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="0.5" cy="0.72" r="0.7">
          <stop offset="0" style={{ stopColor: "var(--gold-pale)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--saffron)" }} />
          <stop offset="1" style={{ stopColor: "var(--ember)" }} />
        </radialGradient>
      </defs>
      <path d="M12 8C12 3 48 3 48 8C56 26 52 52 44 68H16C8 52 4 26 12 8Z" fill={`url(#${id})`} />
      <path d="M16 68H44L41 76H19Z" fill="var(--brass)" />
      <path d="M22 9C17 28 18 50 23 67M38 9C43 28 42 50 37 67" fill="none" stroke="var(--ember)" strokeOpacity="0.45" strokeWidth="1" />
      <path d="M30 62C34 56 33 50 30 46C27 50 26 56 30 62Z" fill="var(--ivory)" opacity="0.9" />
    </svg>
  );
}
