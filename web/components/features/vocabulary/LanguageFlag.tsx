import { cn } from "@/lib/utils";

type LanguageFlagProps = {
  code: "tr" | "en";
  className?: string;
  title?: string;
};

export function LanguageFlag({ code, className, title }: LanguageFlagProps) {
  if (code === "tr") {
    return (
      <svg
        viewBox="0 0 24 16"
        className={cn(
          "h-3.5 w-5 shrink-0 overflow-hidden rounded-sm",
          className,
        )}
        aria-hidden={title ? undefined : true}
        role={title ? "img" : undefined}
        aria-label={title}
      >
        {title ? <title>{title}</title> : null}
        <rect width="24" height="16" fill="#E30A17" />
        <circle cx="9.2" cy="8" r="4" fill="#fff" />
        <circle cx="10.6" cy="8" r="3.2" fill="#E30A17" />
        <polygon
          fill="#fff"
          points="14.8,8 16.55,8.58 15.55,7.05 16.55,5.52 14.8,6.1 13.05,5.52 14.05,7.05 13.05,8.58"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 16"
      className={cn("h-3.5 w-5 shrink-0 overflow-hidden rounded-sm", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <rect width="24" height="16" fill="#B22234" />
      <path
        fill="#fff"
        d="M0 1.23h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0z"
      />
      <rect width="10" height="8.6" fill="#3C3B6E" />
    </svg>
  );
}
