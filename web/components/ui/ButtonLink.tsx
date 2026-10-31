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
    "bg-brand-800 text-brand-100 hover:bg-brand-900 dark:bg-brand-400 dark:text-brand-950 dark:hover:bg-[#b6c3d8]",
  secondary:
    "border border-brand-400/60 bg-transparent text-brand-950 hover:bg-brand-100/70 dark:border-brand-600 dark:text-brand-100 dark:hover:bg-brand-900",
  ghost:
    "bg-transparent text-brand-800 hover:bg-brand-100/70 dark:text-brand-400 dark:hover:bg-brand-900",
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
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-brand-950 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
