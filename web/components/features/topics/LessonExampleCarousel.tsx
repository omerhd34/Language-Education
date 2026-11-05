"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { LessonSpeakButton } from "@/components/features/topics/LessonSpeakButton";
import { Button } from "@/components/ui/Button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import type {
  TopicLessonExample,
  TopicLessonExampleHeaders,
} from "@/data/topics/types";
import { cn } from "@/lib/utils";

type LessonExampleCarouselProps = {
  title: string;
  examples: TopicLessonExample[];
  headers?: TopicLessonExampleHeaders;
};

function stopCardToggle(event: { stopPropagation: () => void }) {
  event.stopPropagation();
}

function spellingLabel(note?: string): string | null {
  if (!note) {
    return null;
  }
  const match = note.match(/^(.+?)\s*→/);
  const label = match?.[1]?.trim();
  return label ? label : null;
}

function spellingLetters(label: string): string | null {
  const match = label.match(/^[a-zA-Z]+/);
  return match?.[0] ?? null;
}

function SpelledWord({
  word,
  letters,
}: {
  word: string;
  letters: string | null;
}) {
  if (!letters) {
    return word;
  }

  const index = word.toLowerCase().indexOf(letters.toLowerCase());
  if (index < 0) {
    return word;
  }

  const end = index + letters.length;

  return (
    <>
      {word.slice(0, index)}
      <span className="text-sky-600 dark:text-sky-400">
        {word.slice(index, end)}
      </span>
      {word.slice(end)}
    </>
  );
}

const FLIP_BACK_MS = 10_000;

function CardFlipHint() {
  const t = useTranslations("Topic");

  return (
    <p className="absolute inset-x-0 bottom-3 inline-flex items-center justify-center gap-1 text-xs text-brand-400">
      <RefreshCw className="size-3" aria-hidden />
      {t("cardHint")}
    </p>
  );
}

function LessonFlipCard({ example }: { example: TopicLessonExample }) {
  const t = useTranslations("Topic");
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!flipped) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setFlipped(false);
    }, FLIP_BACK_MS);

    return () => window.clearTimeout(timeout);
  }, [flipped]);

  const hero = example.exampleEn ?? example.tr;
  const caption = example.exampleTr ?? example.note;
  const reading = example.exampleEn ? example.tr : null;
  const spelling = spellingLabel(example.note);
  const letters = spelling ? spellingLetters(spelling) : null;
  const spoken =
    example.exampleEn ?? (example.speakTr ? example.tr : example.en);

  function toggle() {
    setFlipped((value) => !value);
  }

  return (
    <div className="relative h-44 perspective-[900px]">
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={
          flipped
            ? t("cardFlipBack", { text: example.en })
            : t("cardFlip", { text: example.en })
        }
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
          }
        }}
        className={cn(
          "relative h-full cursor-pointer transition-transform duration-500 transform-3d",
          flipped && "rotate-y-180",
        )}
      >
        <div className="absolute inset-0 rounded-xl border border-border bg-background/70 backface-hidden dark:bg-brand-950/40">
          <span
            className="absolute top-2 right-2 z-10 inline-flex"
            onClick={stopCardToggle}
            onKeyDown={stopCardToggle}
          >
            <LessonSpeakButton text={example.en} size="icon-sm" />
          </span>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-3 text-center">
            <p className="font-display text-2xl leading-none font-semibold text-brand-950 dark:text-brand-100">
              <SpelledWord word={example.en} letters={letters} />
            </p>
            {reading ? (
              <p className="text-sm font-medium tracking-wide text-brand-500 dark:text-brand-300">
                {reading}
              </p>
            ) : null}
            {spelling && !reading ? (
              <p className="text-sm font-semibold tracking-wide text-sky-600 dark:text-sky-400">
                {spelling}
              </p>
            ) : null}
          </div>
          <CardFlipHint />
        </div>

        <div className="absolute inset-0 flex rotate-y-180 flex-col items-center justify-center gap-1 rounded-xl border border-brand-200 bg-brand-50 px-3 text-center backface-hidden dark:border-brand-700 dark:bg-brand-900">
          <span
            className="absolute top-2 right-2 z-10 inline-flex"
            onClick={stopCardToggle}
            onKeyDown={stopCardToggle}
          >
            <LessonSpeakButton text={spoken} size="icon-sm" />
          </span>
          <p className="font-display text-2xl leading-none font-semibold text-brand-950 dark:text-brand-50">
            {hero}
          </p>
          {caption ? (
            <p className="text-sm text-brand-600 dark:text-brand-300">
              {caption}
            </p>
          ) : null}
          <CardFlipHint />
        </div>
      </div>
    </div>
  );
}

function ExampleCarouselControls() {
  const t = useTranslations("Topic");
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();

  return (
    <div className="flex shrink-0 gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={!canScrollPrev}
        aria-label={t("examplesPrevious")}
        onClick={scrollPrev}
      >
        <ChevronLeft aria-hidden />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={!canScrollNext}
        aria-label={t("examplesNext")}
        onClick={scrollNext}
      >
        <ChevronRight aria-hidden />
      </Button>
    </div>
  );
}

export function LessonExampleCarousel({
  title,
  examples,
  headers,
}: LessonExampleCarouselProps) {
  return (
    <Carousel
      opts={{ align: "start", dragFree: true }}
      aria-label={title}
      className="space-y-2"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-xs font-semibold tracking-wide text-brand-500 uppercase dark:text-brand-400">
            {title}
          </h3>
          {headers ? (
            <p className="mt-0.5 text-xs text-brand-400">
              {headers.en}
              <span aria-hidden> · </span>
              {headers.tr}
            </p>
          ) : null}
        </div>
        <ExampleCarouselControls />
      </div>

      <CarouselContent className="-ml-3">
        {examples.map((example) => (
          <CarouselItem
            key={`${example.en}-${example.tr}`}
            className="basis-[72%] pl-3 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
          >
            <LessonFlipCard example={example} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
