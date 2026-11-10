"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type WritingTaskDisclosureProps = {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
};

export function WritingTaskDisclosure({
  title,
  defaultOpen = false,
  children,
  className,
}: WritingTaskDisclosureProps) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        "group overflow-hidden rounded-2xl border border-sky-500/20 bg-card shadow-sm dark:border-sky-400/25",
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-sky-600 px-4 py-3 text-base font-semibold text-white marker:content-none dark:bg-sky-900/80 [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <ChevronDown
          className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="border-t border-border bg-card p-4 sm:p-6 dark:bg-brand-950/40">
        {children}
      </div>
    </details>
  );
}
