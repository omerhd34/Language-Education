"use client";

import { useTranslations } from "next-intl";
import { Copy, Volume2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ReadingWordLookupResult } from "@/lib/reading/readingWordLookup";
import { speakText } from "@/lib/speakText";
import { cn } from "@/lib/utils";

type ReadingWordLookupPopoverProps = {
  tokenId: string;
  surface: string;
  lookup: ReadingWordLookupResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emphasize?: boolean;
  wordClassName?: string;
};

export function ReadingWordLookupPopover({
  tokenId,
  surface,
  lookup,
  open,
  onOpenChange,
  emphasize = false,
  wordClassName,
}: ReadingWordLookupPopoverProps) {
  const t = useTranslations("Reading");
  const display = lookup?.display ?? surface;
  const translation = lookup?.tr;

  async function copyTranslation() {
    if (!translation) {
      return;
    }
    try {
      await navigator.clipboard.writeText(translation);
    } catch {
      /* ignore */
    }
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        type="button"
        id={tokenId}
        className={cn(
          "cursor-pointer rounded-sm px-0.5 transition-colors",
          "hover:bg-amber-100/90 dark:hover:bg-amber-400/15",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50",
          open && "bg-amber-100 dark:bg-amber-400/20",
          emphasize && "font-semibold text-brand-950 dark:text-brand-50",
          wordClassName,
        )}
        aria-label={t("wordTapAria", { word: display })}
      >
        {surface}
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        sideOffset={10}
        className={cn(
          "z-200 w-[min(20rem,calc(100vw-2rem))] gap-3 rounded-2xl border border-border p-4",
          "bg-white text-brand-950 shadow-xl ring-1 ring-black/5",
          "dark:border-brand-700 dark:bg-brand-950 dark:text-brand-50 dark:ring-white/10",
        )}
      >
        {lookup?.level ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="rounded-full px-2 text-xs">
              {lookup.level}
            </Badge>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-xl font-semibold text-brand-950 dark:text-brand-50">
            {display}
          </p>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label={t("listenWord")}
              onClick={() => speakText(display)}
            >
              <Volume2 className="size-4" aria-hidden />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              disabled={!translation}
              aria-label={t("copyTranslation")}
              onClick={() => void copyTranslation()}
            >
              <Copy className="size-4" aria-hidden />
            </Button>
          </div>
        </div>

        {translation ? (
          <p className="text-base font-medium text-sky-600 dark:text-sky-400">
            {translation}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("wordTranslationMissing")}
          </p>
        )}

        <p className="border-t border-border pt-2 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
          {t("wordDictionaryBrand")}
        </p>
      </PopoverContent>
    </Popover>
  );
}
