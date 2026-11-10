"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type WritingPracticeCollapsibleProps = {
  header: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export function WritingPracticeCollapsible({
  header,
  children,
  defaultOpen = false,
  className,
}: WritingPracticeCollapsibleProps) {
  return (
    <details open={defaultOpen} className={cn("group", className)}>
      <summary className="flex cursor-pointer list-none items-center gap-3 marker:content-none [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">{header}</div>
        <ChevronDown
          className="size-5 shrink-0 text-sky-700 transition-transform duration-200 group-open:rotate-180 dark:text-sky-300"
          aria-hidden
        />
      </summary>
      <div className="pt-4">{children}</div>
    </details>
  );
}
