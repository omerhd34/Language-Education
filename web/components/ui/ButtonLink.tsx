import { Link } from "@/i18n/navigation";

type ButtonLinkVariant = "primary" | "secondary" | "ghost";
type ButtonLinkSize = "sm" | "md";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonLinkVariant;
  size?: ButtonLinkSize;
  className?: string;
  onClick?: () => void;
};

const variantClasses: Record<ButtonLinkVariant, string> = {
  primary:
    "bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-500 dark:text-zinc-950 dark:hover:bg-teal-400",
  secondary:
    "border border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-50 dark:hover:bg-zinc-800",
  ghost:
    "bg-transparent text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
};

const sizeClasses: Record<ButtonLinkSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
