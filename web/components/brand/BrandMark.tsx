import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  title?: string;
};

/** Pylmor mark — geometric “P” glyph for light/dark glass surfaces. */
export function BrandMark({ className, title }: BrandMarkProps) {
  const label = title?.trim();

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 text-current", className)}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
    >
      {label ? <title>{label}</title> : null}
      <path
        d="M9 6.5h9.2c4.05 0 7.05 2.55 7.05 6.55S22.25 19.6 18.2 19.6H13.5V25.5H9V6.5Zm4.5 4.1v4.9h4.45c1.85 0 2.95-1.05 2.95-2.45s-1.1-2.45-2.95-2.45H13.5Z"
        fill="currentColor"
      />
      <path
        d="M22.8 22.2c1.55 1.35 2.45 2.85 2.45 4.55H20.7c0-.7-.4-1.4-1.1-2.05"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
