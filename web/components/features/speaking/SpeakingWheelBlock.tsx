/* eslint-disable react-hooks/refs */
"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useTranslations } from "next-intl";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SpeakingTimedMicControl } from "@/components/features/speaking/SpeakingTimedMicControl";
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

function wheelSliceColor(index: number, total: number): string {
  if (total <= 0) {
    return "transparent";
  }
  const hue = Math.round((index * 360) / total);
  return `hsl(${hue} 68% 46%)`;
}

const SPIN_MS = 4200;
const FLICK_VELOCITY = 0.35;

function normalizeAngleDelta(delta: number): number {
  let adjusted = delta;
  if (adjusted > 180) {
    adjusted -= 360;
  }
  if (adjusted < -180) {
    adjusted += 360;
  }
  return adjusted;
}

function angleFromCenter(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): number {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
}

function spinDeltaToLandOnIndex(
  currentRotationDeg: number,
  index: number,
  segmentAngle: number,
  extraTurns: number,
): number {
  const currentMod = ((currentRotationDeg % 360) + 360) % 360;
  const sliceCenter = (index + 0.5) * segmentAngle;
  const desiredMod = (360 - sliceCenter) % 360;
  let alignDelta = (desiredMod - currentMod + 360) % 360;
  if (alignDelta === 0) {
    alignDelta = 360;
  }
  return extraTurns * 360 + alignDelta;
}

export function SpeakingWheelBlock({
  exercise,
  completedIds,
  onMarkComplete,
}: SpeakingWheelBlockProps) {
  const t = useTranslations("Speaking");
  const wheelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    lastAngle: number;
    lastTime: number;
    velocity: number;
  } | null>(null);

  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  rotationRef.current = rotation;
  const [spinning, setSpinning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [activeItem, setActiveItem] = useState<SpeakingPromptItem | null>(null);

  const n = exercise.items.length;
  const segmentAngle = n > 0 ? 360 / n : 0;

  const wheelBackground = useMemo(() => {
    if (n === 0) {
      return "transparent";
    }
    const stops = exercise.items.map((_, index) => {
      const start = (index / n) * 100;
      const end = ((index + 1) / n) * 100;
      const color = wheelSliceColor(index, n);
      return `${color} ${start}% ${end}%`;
    });
    return `conic-gradient(from -90deg, ${stops.join(", ")})`;
  }, [exercise.items, n]);

  const remainingCount = exercise.items.filter(
    (item) => !completedIds.has(item.id),
  ).length;

  const runSpinAnimation = useCallback(() => {
    if (spinning || remainingCount === 0 || n === 0) {
      return;
    }
    const remaining = exercise.items.filter(
      (item) => !completedIds.has(item.id),
    );
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    if (!pick) {
      return;
    }
    const index = exercise.items.findIndex((item) => item.id === pick.id);
    const extraTurns = 4 + Math.floor(Math.random() * 3);
    const target = spinDeltaToLandOnIndex(
      rotationRef.current,
      index,
      segmentAngle,
      extraTurns,
    );

    setSpinning(true);
    setActiveItem(null);
    setRotation((prev) => {
      const next = prev + target;
      rotationRef.current = next;
      return next;
    });

    window.setTimeout(() => {
      setSpinning(false);
      setActiveItem(pick);
    }, SPIN_MS);
  }, [completedIds, exercise.items, n, remainingCount, segmentAngle, spinning]);

  function handleWheelPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (spinning || remainingCount === 0) {
      return;
    }
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    dragRef.current = {
      lastAngle: angleFromCenter(event.clientX, event.clientY, rect),
      lastTime: performance.now(),
      velocity: 0,
    };
  }

  function handleWheelPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragRef.current || spinning) {
      return;
    }
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    const angle = angleFromCenter(event.clientX, event.clientY, rect);
    const delta = normalizeAngleDelta(angle - dragRef.current.lastAngle);
    setRotation((prev) => prev + delta);

    const now = performance.now();
    const dt = now - dragRef.current.lastTime;
    if (dt > 0) {
      dragRef.current.velocity = delta / dt;
    }
    dragRef.current.lastAngle = angle;
    dragRef.current.lastTime = now;
  }

  function finishWheelDrag(
    event: ReactPointerEvent<HTMLDivElement>,
    triggerSpinOnFlick: boolean,
  ) {
    if (!dragRef.current) {
      return;
    }
    const velocity = dragRef.current.velocity;
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (triggerSpinOnFlick && Math.abs(velocity) >= FLICK_VELOCITY) {
      runSpinAnimation();
    }
  }

  function handleWheelPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    finishWheelDrag(event, true);
  }

  function handleWheelPointerCancel(event: ReactPointerEvent<HTMLDivElement>) {
    finishWheelDrag(event, false);
  }

  const dividerLines = useMemo(() => {
    if (n === 0) {
      return null;
    }
    return exercise.items.map((item, index) => {
      const angleDeg = index * segmentAngle - 90;
      const rad = (angleDeg * Math.PI) / 180;
      const x2 = 50 + 50 * Math.cos(rad);
      const y2 = 50 + 50 * Math.sin(rad);
      return (
        <line
          key={`divider-${item.id}`}
          x1="50"
          y1="50"
          x2={x2}
          y2={y2}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="0.6"
        />
      );
    });
  }, [exercise.items, n, segmentAngle]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      <div className="flex shrink-0 flex-col items-start gap-3">
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
          onClick={runSpinAnimation}
        >
          <RotateCw
            className={cn("size-4", spinning && "motion-safe:animate-spin")}
            aria-hidden
          />
          {remainingCount === 0 ? t("wheelAllDone") : t("wheelSpin")}
        </Button>
      </div>

      <div className="mx-auto shrink-0 lg:mx-0">
        <div className="relative size-64 sm:size-72">
          <svg
            className="absolute -top-1 left-1/2 z-20 -translate-x-1/2 drop-shadow-md"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            aria-hidden
          >
            <path
              d="M11 18 1 2h20L11 18Z"
              className="fill-brand-900 dark:fill-brand-50"
            />
            <path
              d="M11 15 4 4h14L11 15Z"
              className="fill-brand-700 dark:fill-brand-200"
            />
          </svg>

          <div
            className={cn(
              "absolute inset-0 rounded-full",
              "bg-linear-to-br from-white/40 to-transparent",
              "shadow-[0_10px_40px_rgba(15,23,42,0.18),inset_0_0_0_1px_rgba(255,255,255,0.35)]",
              "dark:shadow-[0_10px_40px_rgba(0,0,0,0.45),inset_0_0_0_1px_rgba(255,255,255,0.12)]",
            )}
            aria-hidden
          />

          <div
            ref={wheelRef}
            role="application"
            aria-label={t("wheelSpin")}
            tabIndex={remainingCount > 0 && !spinning ? 0 : undefined}
            className={cn(
              "absolute inset-1.5 touch-none select-none rounded-full",
              "shadow-[inset_0_2px_12px_rgba(0,0,0,0.15)]",
              "ring-[3px] ring-white/50 dark:ring-white/15",
              remainingCount > 0 && !spinning && "cursor-grab",
              dragging && "cursor-grabbing",
              spinning
                ? "transition-transform ease-out motion-safe:duration-4200"
                : dragging
                  ? "transition-none"
                  : "transition-transform duration-200 ease-out",
            )}
            style={{
              background: wheelBackground,
              transform: `rotate(${rotation}deg)`,
            }}
            onPointerDown={handleWheelPointerDown}
            onPointerMove={handleWheelPointerMove}
            onPointerUp={handleWheelPointerUp}
            onPointerCancel={handleWheelPointerCancel}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                runSpinAnimation();
              }
            }}
          >
            <svg
              className="pointer-events-none absolute inset-0 size-full"
              viewBox="0 0 100 100"
              aria-hidden
            >
              <circle
                cx="50"
                cy="50"
                r="49"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="0.75"
              />
              {dividerLines}
            </svg>

            {exercise.items.map((item, index) => {
              const midAngle = (index + 0.5) * segmentAngle - 90;
              const rad = (midAngle * Math.PI) / 180;
              const labelR = 36;
              const x = 50 + labelR * Math.cos(rad);
              const y = 50 + labelR * Math.sin(rad);
              const done = completedIds.has(item.id);
              return (
                <span
                  key={item.id}
                  className={cn(
                    "pointer-events-none absolute text-[11px] font-bold tracking-tight text-white",
                    "drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]",
                    done && "opacity-60",
                  )}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) rotate(${midAngle + 90}deg)`,
                  }}
                >
                  {done ? "✓" : index + 1}
                </span>
              );
            })}
          </div>

          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden
          >
            <div
              className={cn(
                "size-16 rounded-full",
                "bg-linear-to-br from-card to-brand-100 dark:from-brand-900 dark:to-brand-950",
                "shadow-[0_4px_14px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.5)]",
                "ring-[3px] ring-white/60 dark:ring-white/20",
              )}
            />
            <div className="absolute size-5 rounded-full bg-brand-800/20 dark:bg-brand-100/25" />
          </div>
        </div>
      </div>

      <div className="w-full min-w-0 max-w-md lg:flex-1">
        {activeItem ? (
          <div className="dashboard-panel space-y-3 p-4">
            <div className="space-y-0.5">
              <p className="text-base font-medium text-brand-800 dark:text-brand-200">
                {activeItem.prompt}
              </p>
              {activeItem.promptTr ? (
                <p className="text-sm text-brand-500 italic dark:text-brand-400">
                  {activeItem.promptTr}
                </p>
              ) : null}
            </div>
            {!completedIds.has(activeItem.id) ? (
              <SpeakingTimedMicControl
                sessionKey={activeItem.id}
                onRequirementMet={() => onMarkComplete(activeItem.id)}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
