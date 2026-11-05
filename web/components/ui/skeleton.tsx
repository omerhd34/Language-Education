import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-brand-100 dark:bg-brand-800",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
