/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import {
  getVocabularyWordFallbackImageUrl,
  getVocabularyWordImageUrl,
} from "@/lib/vocabulary/imageUrl";
import { cn } from "@/lib/utils";

type VocabularyWordImageProps = {
  wordId: string;
  wordEn: string;
  image?: string;
  alt: string;
  className?: string;
};

export function VocabularyWordImage({
  wordId,
  wordEn,
  image,
  alt,
  className,
}: VocabularyWordImageProps) {
  const customSrc = getVocabularyWordImageUrl({
    id: wordId,
    en: wordEn,
    image,
  });
  const generatedSrc = getVocabularyWordFallbackImageUrl({
    id: wordId,
    en: wordEn,
  });
  const hasCustom = Boolean(image?.trim());
  const [src, setSrc] = useState(customSrc);
  const [failed, setFailed] = useState(false);
  const initial = wordEn.trim().charAt(0).toUpperCase() || "?";

  if (failed) {
    return (
      <div
        className={cn(
          "flex size-full items-center justify-center bg-linear-to-br from-teal-100 via-sky-50 to-amber-50 dark:from-teal-950 dark:via-brand-900 dark:to-amber-950",
          className,
        )}
        aria-hidden
      >
        <span className="font-display text-3xl font-semibold text-teal-700/80 dark:text-teal-200/80">
          {initial}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative size-full overflow-hidden", className)}>
      <div
        className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-brand-100 to-brand-50 dark:from-brand-900 dark:to-brand-950"
        aria-hidden
      >
        <ImageIcon className="size-6 text-brand-400/70 dark:text-brand-500/70" />
      </div>
      <img
        key={src}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="relative z-10 size-full object-cover"
        onError={() => {
          if (hasCustom && src === customSrc && customSrc !== generatedSrc) {
            setSrc(generatedSrc);
            return;
          }
          setFailed(true);
        }}
      />
    </div>
  );
}
