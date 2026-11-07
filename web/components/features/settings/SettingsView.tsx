"use client";

import { useTranslations } from "next-intl";
import { Gauge, Palette } from "lucide-react";
import { NotificationSettingsPanel } from "@/components/features/settings/NotificationSettingsPanel";
import { ProgressResetPanel } from "@/components/features/settings/ProgressResetPanel";
import { SettingsSection } from "@/components/features/settings/SettingsSection";
import { ThemeSetting } from "@/components/features/settings/ThemeSetting";
import { SpeechRateControl } from "@/components/features/vocabulary/SpeechRateControl";

export function SettingsView() {
  const t = useTranslations("Settings");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-950 dark:text-brand-100">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-brand-600 dark:text-brand-400 sm:text-[0.95rem]">
          {t("description")}
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start lg:gap-6">
        <SettingsSection
          titleId="settings-appearance"
          title={t("appearance")}
          description={t("appearanceHint")}
          icon={<Palette className="size-5" aria-hidden />}
        >
          <ThemeSetting />
        </SettingsSection>

        <NotificationSettingsPanel />
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start lg:gap-6">
        <SettingsSection
          titleId="settings-speech-rate"
          title={t("speechRateLabel")}
          description={t("speechRateHint")}
          icon={<Gauge className="size-5" aria-hidden />}
        >
          <SpeechRateControl />
        </SettingsSection>

        <ProgressResetPanel />
      </div>
    </div>
  );
}
