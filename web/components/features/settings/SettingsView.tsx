"use client";

import { useTranslations } from "next-intl";
import { Gauge, Palette } from "lucide-react";
import { ChangePasswordPanel } from "@/components/features/settings/ChangePasswordPanel";
import { NotificationSettingsPanel } from "@/components/features/settings/NotificationSettingsPanel";
import { ProfileSetting } from "@/components/features/settings/ProfileSetting";
import { ProgressResetPanel } from "@/components/features/settings/ProgressResetPanel";
import { SettingsSection } from "@/components/features/settings/SettingsSection";
import { LocaleSetting } from "@/components/features/settings/LocaleSetting";
import { ThemeSetting } from "@/components/features/settings/ThemeSetting";
import { SpeechRateControl } from "@/components/features/vocabulary/SpeechRateControl";

export function SettingsView() {
  const t = useTranslations("Settings");

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-950 dark:text-brand-100">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-brand-600 dark:text-brand-400 sm:text-[0.95rem]">
          {t("description")}
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start lg:gap-6">
        <ProfileSetting />

        <SettingsSection
          titleId="settings-appearance"
          title={t("appearance")}
          description={t("appearanceHint")}
          icon={<Palette className="size-5" aria-hidden />}
        >
          <div className="space-y-5">
            <ThemeSetting />
            <LocaleSetting />
          </div>
        </SettingsSection>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start lg:gap-6">
        <NotificationSettingsPanel />

        <SettingsSection
          titleId="settings-speech-rate"
          title={t("speechRateLabel")}
          description={t("speechRateHint")}
          icon={<Gauge className="size-5" aria-hidden />}
        >
          <SpeechRateControl />
        </SettingsSection>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start lg:gap-6">
        <ChangePasswordPanel />
        <ProgressResetPanel />
      </div>
    </div>
  );
}
