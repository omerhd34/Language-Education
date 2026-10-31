import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-brand-950",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-800 text-brand-100 shadow hover:bg-brand-800/90 dark:bg-brand-400 dark:text-brand-950 dark:hover:bg-brand-400/90",
        secondary:
          "border-transparent bg-surface-muted text-brand-950 hover:bg-surface-muted/80 dark:bg-brand-900 dark:text-brand-100 dark:hover:bg-brand-900/80",
        destructive:
          "border-transparent bg-red-700 text-white shadow hover:bg-red-700/90 dark:bg-red-600 dark:hover:bg-red-600/90",
        outline:
          "border-brand-400/60 text-brand-950 dark:border-brand-600 dark:text-brand-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = ComponentProps<"div"> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
