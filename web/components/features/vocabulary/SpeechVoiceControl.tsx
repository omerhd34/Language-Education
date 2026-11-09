"use client";

import { useTranslations } from "next-intl";
import { Check, UserRound } from "lucide-react";
import { useSpeechVoiceGender } from "@/hooks/useSpeechVoiceGender";
import { SPEECH_VOICE_GENDERS, speakText } from "@/lib/speakText";
import type { SpeechVoiceGender } from "@/lib/speechVoiceGender";
import { cn } from "@/lib/utils";

const GENDER_LABEL_KEYS = {
  female: "speechVoiceFemale",
  male: "speechVoiceMale",
} as const satisfies Record<SpeechVoiceGender, string>;

const GENDER_HINT_KEYS = {
  female: "speechVoiceFemaleHint",
  male: "speechVoiceMaleHint",
} as const satisfies Record<SpeechVoiceGender, string>;

type SpeechVoiceControlProps = {
  className?: string;
};

export function SpeechVoiceControl({ className }: SpeechVoiceControlProps) {
  const t = useTranslations("Settings");
  const { gender, setGender } = useSpeechVoiceGender();

  return (
    <fieldset className={cn("space-y-2 border-0 p-0", className)}>
      <legend className="mb-3 text-sm font-medium text-brand-950 dark:text-brand-100">
        {t("speechVoiceGenderLabel")}
      </legend>
      <ul role="group" aria-label={t("speechVoiceGenderLabel")}>
        {SPEECH_VOICE_GENDERS.map((option) => {
          const selected = gender === option;
          const label = t(GENDER_LABEL_KEYS[option]);
          return (
            <li key={option} className="mb-2 last:mb-0">
              <button
                type="button"
                aria-pressed={selected}
                aria-label={t("speechVoicePreview", { voice: label })}
                onClick={() => {
                  setGender(option);
                  speakText(t("speechRatePreviewSample"), "en-US");
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40",
                  selected
                    ? "border-sky-500/45 bg-sky-500/5 dark:border-sky-400/40 dark:bg-sky-400/10"
                    : "border-border bg-background/80 hover:border-sky-500/45 hover:bg-sky-500/5 dark:bg-brand-950/40",
                )}
              >
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200">
                  <UserRound className="size-3.5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1 space-y-0.5">
                  <span className="block text-sm font-medium text-brand-950 dark:text-brand-100">
                    {label}
                  </span>
                  <span className="block text-xs leading-snug text-brand-600 dark:text-brand-400">
                    {t(GENDER_HINT_KEYS[option])}
                  </span>
                </span>
                <span
                  className={cn(
                    "inline-flex size-6 shrink-0 items-center justify-center rounded-full transition-colors",
                    selected
                      ? "bg-sky-600 text-white dark:bg-sky-500 dark:text-sky-950"
                      : "bg-brand-100 text-transparent dark:bg-brand-900",
                  )}
                  aria-hidden
                >
                  <Check className="size-3.5" strokeWidth={2.5} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
