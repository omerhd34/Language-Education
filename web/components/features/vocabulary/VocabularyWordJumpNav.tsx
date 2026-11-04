"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { VocabularyWord } from "@/data/vocabulary";
import {
  getVocabularyWordElementId,
  scrollToVocabularyWord,
} from "@/lib/vocabulary/similarWords";
import { cn } from "@/lib/utils";

type VocabularyWordJumpNavProps = {
  words: VocabularyWord[];
  className?: string;
};

export function VocabularyWordJumpNav({
  words,
  className,
}: VocabularyWordJumpNavProps) {
  const t = useTranslations("Vocabulary");
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const node = scrollerRef.current;
    if (!node) {
      return;
    }

    const maxScroll = node.scrollWidth - node.clientWidth;
    setCanScrollLeft(node.scrollLeft > 4);
    setCanScrollRight(node.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) {
      return;
    }

    updateScrollState();
    node.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(node);

    return () => {
      node.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState, words.length]);

  function scrollByAmount(direction: -1 | 1) {
    const node = scrollerRef.current;
    if (!node) {
      return;
    }
    const amount = Math.max(180, Math.round(node.clientWidth * 0.65));
    node.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  if (words.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(
        "relative rounded-2xl border border-brand-200/70 bg-white/80 py-2.5 dark:border-brand-800/70 dark:bg-brand-950/40",
        className,
      )}
      aria-label={t("wordJumpNavAria")}
    >
      <div className="relative flex items-center gap-1 px-2">
        <button
          type="button"
          onClick={() => scrollByAmount(-1)}
          disabled={!canScrollLeft}
          aria-label={t("wordJumpNavPrev")}
          className={cn(
            "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand-200/80 bg-white text-brand-700 shadow-sm transition-[opacity,background-color,color] dark:border-brand-700 dark:bg-brand-900 dark:text-brand-200",
            "hover:bg-sky-500/10 hover:text-sky-800 dark:hover:bg-sky-400/15 dark:hover:text-sky-100",
            "disabled:cursor-default disabled:opacity-35 disabled:hover:bg-white dark:disabled:hover:bg-brand-900",
          )}
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-white to-transparent transition-opacity dark:from-brand-950/95",
              canScrollLeft ? "opacity-100" : "opacity-0",
            )}
            aria-hidden
          />
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-white to-transparent transition-opacity dark:from-brand-950/95",
              canScrollRight ? "opacity-100" : "opacity-0",
            )}
            aria-hidden
          />

          <ul
            ref={scrollerRef}
            className="flex snap-x snap-mandatory flex-nowrap gap-1.5 overflow-x-auto scroll-smooth px-1 py-0.5 scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {words.map((word, index) => (
              <li key={word.id} className="shrink-0 snap-start">
                <button
                  type="button"
                  onClick={() => scrollToVocabularyWord(word.id)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-brand-100 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-brand-800 transition-colors hover:bg-sky-500/15 hover:text-sky-800 dark:bg-brand-900 dark:text-brand-200 dark:hover:bg-sky-400/20 dark:hover:text-sky-100"
                  aria-controls={getVocabularyWordElementId(word.id)}
                >
                  <span className="tabular-nums text-brand-500 dark:text-brand-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{word.tr}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => scrollByAmount(1)}
          disabled={!canScrollRight}
          aria-label={t("wordJumpNavNext")}
          className={cn(
            "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand-200/80 bg-white text-brand-700 shadow-sm transition-[opacity,background-color,color] dark:border-brand-700 dark:bg-brand-900 dark:text-brand-200",
            "hover:bg-sky-500/10 hover:text-sky-800 dark:hover:bg-sky-400/15 dark:hover:text-sky-100",
            "disabled:cursor-default disabled:opacity-35 disabled:hover:bg-white dark:disabled:hover:bg-brand-900",
          )}
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </nav>
  );
}
