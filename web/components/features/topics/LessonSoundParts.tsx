"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LessonPartBlock } from "@/components/features/topics/LessonPartBlock";
import { Button } from "@/components/ui/Button";
import type { TopicLessonPart } from "@/data/topics/types";
import { cn } from "@/lib/utils";

type LessonSoundPartsProps = {
  parts: TopicLessonPart[];
  defaultExamplesTitle: string;
};

export function LessonSoundParts({
  parts,
  defaultExamplesTitle,
}: LessonSoundPartsProps) {
  const t = useTranslations("Topic");
  const [openId, setOpenId] = useState<string | null>(parts[0]?.id ?? null);
  const openPart = parts.find((part) => part.id === openId) ?? null;

  return (
    <div className="space-y-4">
      <div
        role="group"
        aria-label={t("soundPickerAria")}
        className="flex flex-wrap gap-2"
      >
        {parts.map((part) => {
          const selected = part.id === openId;

          return (
            <Button
              key={part.id}
              type="button"
              variant="ghost"
              size="xs"
              aria-pressed={selected}
              aria-expanded={selected}
              aria-controls={selected ? `section-${part.id}` : undefined}
              aria-label={part.shortTitle ? part.title : undefined}
              className={cn(
                "h-auto rounded-md bg-brand-100/70 px-2.5 py-1.5 text-sm font-medium text-brand-700 hover:bg-sky-500/15 hover:text-brand-950 dark:bg-brand-900/50 dark:text-brand-300 dark:hover:bg-sky-500/20 dark:hover:text-brand-100",
                selected &&
                  "bg-sky-500/15 text-brand-950 ring-1 ring-sky-500/40 hover:bg-sky-500/20 dark:bg-sky-500/20 dark:text-brand-100 dark:ring-sky-400/40",
              )}
              onClick={() => setOpenId(part.id)}
            >
              {part.shortTitle ?? part.title}
            </Button>
          );
        })}
      </div>

      {openPart ? (
        <LessonPartBlock
          part={openPart}
          defaultExamplesTitle={defaultExamplesTitle}
        />
      ) : null}
    </div>
  );
}
