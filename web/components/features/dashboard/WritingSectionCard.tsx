"use client";

import { useTranslations } from "next-intl";
import { Lock, MessageSquare, PencilLine } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { WritingSection } from "@/data/writings/types";
import { useWritingSectionPercent } from "@/hooks/useWritingProgress";
import { getDistinctSecondaryTitle } from "@/lib/bilingualTitle";
import { WRITING_SECTION_ANCHORS } from "@/lib/writingSectionTab";
import { cn } from "@/lib/utils";

type WritingSectionCardProps = {
  section: WritingSection;
  index: number;
  locked?: boolean;
};

export function WritingSectionCard({
  section,
  index,
  locked = false,
}: WritingSectionCardProps) {
  const t = useTranslations("Dashboard");
  const tWriting = useTranslations("Writing");
  const titleEn = getDistinctSecondaryTitle(section.title, section.titleEn);
  const percent = useWritingSectionPercent(section);

  return (
    <div
      className={cn(
        "relative h-full rounded-2xl",
        "[--progress-track:#dce3ef] dark:[--progress-track:#303d59]",
        locked && "opacity-70",
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={tWriting("sectionProgressAria", { progress: percent })}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl ring-3 ring-(--progress-track) ring-inset"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl transition-[background] duration-500 ease-out"
        style={{
          padding: 3,
          background: `conic-gradient(from -90deg, #0ea5e9 ${percent}%, transparent 0)`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <Card className="relative h-full gap-2">
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {tWriting("sectionLabel", { index })}
              </Badge>
              {locked ? (
                <Badge
                  variant="outline"
                  className="gap-1 border-amber-500/40 text-amber-700 dark:text-amber-300"
                >
                  <Lock className="size-3" aria-hidden />
                  {t("locked")}
                </Badge>
              ) : null}
            </div>
            <Badge variant="outline" className="shrink-0 tabular-nums">
              {t("vocabularyProgress", { progress: percent })}
            </Badge>
          </div>

          <div className="space-y-1">
            <CardTitle>{section.title}</CardTitle>
            {titleEn ? (
              <CardDescription className="font-medium tracking-wide text-brand-500 italic dark:text-brand-400">
                {titleEn}
              </CardDescription>
            ) : null}
            {section.summaryTr ? (
              <CardDescription className="line-clamp-2">
                {section.summaryTr}
              </CardDescription>
            ) : null}
          </div>
        </CardHeader>

        <CardFooter className="mt-0 flex flex-row gap-2">
          {locked ? (
            <>
              <Button
                type="button"
                size="sm"
                disabled
                className="min-w-0 flex-1 px-2"
              >
                <MessageSquare aria-hidden />
                <span className="truncate">{tWriting("openModel")}</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled
                className="min-w-0 flex-1 px-2"
              >
                <PencilLine aria-hidden />
                <span className="truncate">{tWriting("openPractice")}</span>
              </Button>
            </>
          ) : (
            <>
              <ButtonLink
                href={`/panel/writing/${section.id}`}
                size="sm"
                className="min-w-0 flex-1 px-2"
              >
                <MessageSquare aria-hidden />
                <span className="truncate">{tWriting("openModel")}</span>
              </ButtonLink>
              <ButtonLink
                href={`/panel/writing/${section.id}#${WRITING_SECTION_ANCHORS.practice}`}
                size="sm"
                variant="outline"
                className="min-w-0 flex-1 px-2"
              >
                <PencilLine aria-hidden />
                <span className="truncate">{tWriting("openPractice")}</span>
              </ButtonLink>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
