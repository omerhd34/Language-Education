"use client";

import { Fragment, useMemo, useState } from "react";
import type { ReadingLevel, ReadingTextHighlight } from "@/data/readings/types";
import { ReadingWordLookupPopover } from "@/components/features/reading/ReadingWordLookupPopover";
import { normalizeEnglishLemma } from "@/lib/reading/normalizeEnglishLemma";
import type { ReadingWordLookupResult } from "@/lib/reading/readingWordLookup";
import {
  splitTextByHighlights,
  tokenizeEnglishText,
} from "@/lib/reading/tokenizeEnglishText";
import { cn } from "@/lib/utils";

type ReadingClickableEnglishTextProps = {
  text: string;
  highlights?: ReadingTextHighlight[];
  readingLevel: ReadingLevel;
  glossary?: Record<string, string>;
  paragraphKey: string;
  className?: string;
};

export function ReadingClickableEnglishText({
  text,
  highlights,
  readingLevel,
  glossary,
  paragraphKey,
  className,
}: ReadingClickableEnglishTextProps) {
  const segments = useMemo(
    () => splitTextByHighlights(text, highlights ?? []),
    [text, highlights],
  );
  const [openTokenId, setOpenTokenId] = useState<string | null>(null);

  function glossaryLookup(
    surface: string,
    lemma: string,
  ): ReadingWordLookupResult | null {
    if (!glossary || !(lemma in glossary)) {
      return null;
    }
    return {
      lemma,
      display: surface.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, "") || lemma,
      tr: glossary[lemma],
      level: readingLevel,
      fromGlossary: true,
    };
  }

  function renderTokens(
    segmentText: string,
    segmentKey: string,
    emphasize: boolean,
  ) {
    const tokens = tokenizeEnglishText(
      segmentText,
      `${paragraphKey}-${segmentKey}`,
    );

    return tokens.map((token) => {
      if (token.kind === "other") {
        return <Fragment key={token.id}>{token.value}</Fragment>;
      }

      const lemma = normalizeEnglishLemma(token.value);
      if (!lemma) {
        return <Fragment key={token.id}>{token.value}</Fragment>;
      }

      const lookup = glossaryLookup(token.value, lemma);
      if (!lookup) {
        return <Fragment key={token.id}>{token.value}</Fragment>;
      }

      return (
        <ReadingWordLookupPopover
          key={token.id}
          tokenId={token.id}
          surface={token.value}
          lookup={lookup}
          open={openTokenId === token.id}
          onOpenChange={(nextOpen) =>
            setOpenTokenId(nextOpen ? token.id : null)
          }
          emphasize={emphasize}
        />
      );
    });
  }

  return (
    <span className={cn(className)}>
      {segments.map((segment, index) => {
        const segmentKey = `${index}-${segment.highlightId ?? "plain"}`;
        const content = renderTokens(
          segment.text,
          segmentKey,
          Boolean(segment.highlightId),
        );

        if (segment.highlightId) {
          return (
            <strong
              key={segmentKey}
              className="font-semibold text-brand-950 dark:text-brand-50"
            >
              {content}
            </strong>
          );
        }

        return <Fragment key={segmentKey}>{content}</Fragment>;
      })}
    </span>
  );
}
