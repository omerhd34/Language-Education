"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type {
  SpeakingPromptItem,
  SpeakingWheelExercise,
} from "@/data/speakings/types";
import { cn } from "@/lib/utils";

type SpeakingWheelBlockProps = {
  exercise: SpeakingWheelExercise;
  completedIds: ReadonlySet<string>;
  onMarkComplete: (id: string) => void;
};

const WHEEL_COLORS = [
  "hsl(199 89% 48%)",
  "hsl(262 83% 58%)",
  "hsl(24 95% 53%)",
  "hsl(142 71% 45%)",
  "hsl(340 82% 52%)",
  "hsl(45 93% 47%)",
];

export function SpeakingWheelBlock({
  exercise,
  completedIds,
  onMarkComplete,
}: SpeakingWheelBlockProps) {
  const t = useTranslations("Speaking");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [activeItem, setActiveItem] = useState<SpeakingPromptItem | null>(null);

  const n = exercise.items.length;
  const segmentAngle = 360 / n;

  const wheelBackground = useMemo(() => {
    if (n === 0) {
      return "transparent";
    }
    const stops = exercise.items.map((_, index) => {
      const start = (index / n) * 100;
      const end = ((index + 1) / n) * 100;
      const color = WHEEL_COLORS[index % WHEEL_COLORS.length];
      return `${color} ${start}% ${end}%`;
    });
    return `conic-gradient(from -90deg, ${stops.join(", ")})`;
  }, [exercise.items, n]);

  const remainingCount = exercise.items.filter(
    (item) => !completedIds.has(item.id),
  ).length;

  function handleSpin() {
    if (spinning || remainingCount === 0) {
      return;
    }
    const remaining = exercise.items.filter(
      (item) => !completedIds.has(item.id),
    );
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    const index = exercise.items.findIndex((item) => item.id === pick.id);
    const extraTurns = 4 + Math.floor(Math.random() * 3);
    const target =
      extraTurns * 360 + (n - index) * segmentAngle - segmentAngle / 2;

    setSpinning(true);
    setActiveItem(null);
    setRotation((prev) => prev + target);

    window.setTimeout(() => {
      setSpinning(false);
      setActiveItem(pick);
    }, 4200);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center sm:gap-8">
        <div className="relative size-56 shrink-0 sm:size-64">
          <div
            className="pointer-events-none absolute -top-2 left-1/2 z-10 size-0 -translate-x-1/2 border-x-8 border-b-14 border-x-transparent border-b-brand-800 dark:border-b-brand-100"
            aria-hidden
          />
          <div
            className={cn(
              "size-full rounded-full border-4 border-border bg-muted shadow-inner transition-transform duration-4000 ease-out",
              spinning && "duration-4000",
            )}
            style={{
              background: wheelBackground,
              transform: `rotate(${rotation}deg)`,
            }}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="size-14 rounded-full border-4 border-border bg-card shadow-sm" />
          </div>
        </div>

        <div className="w-full max-w-md space-y-3">
          <p className="text-sm text-brand-600 dark:text-brand-400">
            {t("wheelProgress", {
              done: completedIds.size,
              total: exercise.items.length,
            })}
          </p>
          <Button
            type="button"
            className="w-full sm:w-auto"
            disabled={spinning || remainingCount === 0}
            onClick={handleSpin}
          >
            <RotateCw
              className={cn("size-4", spinning && "motion-safe:animate-spin")}
              aria-hidden
            />
            {remainingCount === 0 ? t("wheelAllDone") : t("wheelSpin")}
          </Button>

          {activeItem ? (
            <div className="dashboard-panel space-y-3 p-4">
              <p className="text-base font-medium text-brand-800 dark:text-brand-200">
                {activeItem.prompt}
              </p>
              {activeItem.promptTr ? (
                <p className="text-sm text-brand-500 italic dark:text-brand-400">
                  {activeItem.promptTr}
                </p>
              ) : null}
              {!completedIds.has(activeItem.id) ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onMarkComplete(activeItem.id)}
                >
                  <Check className="size-4" aria-hidden />
                  {t("markSpoken")}
                </Button>
              ) : (
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  {t("topicDone")}
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
