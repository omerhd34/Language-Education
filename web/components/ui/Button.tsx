import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-800 text-brand-100 hover:bg-brand-900 dark:bg-brand-400 dark:text-brand-950 dark:hover:bg-[#b6c3d8]",
  secondary:
    "border border-brand-400/60 bg-transparent text-brand-950 hover:bg-brand-100/70 dark:border-brand-600 dark:text-brand-100 dark:hover:bg-brand-900",
  ghost:
    "bg-transparent text-brand-800 hover:bg-brand-100/70 dark:text-brand-400 dark:hover:bg-brand-900",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-brand-950 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
