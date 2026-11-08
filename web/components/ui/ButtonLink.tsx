import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants>;

export function ButtonLink({
  className,
  variant,
  size,
  style,
  ...props
}: ButtonLinkProps) {
  const fixedFontSize =
    size === "xs" ? undefined : ({ fontSize: 15 } as const);

  return (
    <Link
      className={cn(
        buttonVariants({ variant, size }),
        "cursor-pointer",
        className,
      )}
      style={{ ...fixedFontSize, ...style }}
      {...props}
    />
  );
}
