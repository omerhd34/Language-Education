"use client";

import { useTranslations } from "next-intl";
import { SpeechRateControl } from "@/components/features/vocabulary/SpeechRateControl";
import { ThemeSetting } from "@/components/features/settings/ThemeSetting";

export function SettingsView() {
  const t = useTranslations("Settings");

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-brand-950 dark:text-brand-100">
          {t("title")}
        </h1>
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("description")}
        </p>
      </header>

      <section className="dashboard-panel space-y-3" aria-labelledby="settings-appearance">
        <div className="space-y-1">
          <h2
            id="settings-appearance"
            className="text-sm font-semibold text-brand-950 dark:text-brand-100"
          >
            {t("appearance")}
          </h2>
          <p className="text-xs text-brand-600 dark:text-brand-400">
            {t("appearanceHint")}
          </p>
        </div>
        <ThemeSetting />
      </section>

      <section className="space-y-3" aria-label={t("speechRateLabel")}>
        <p className="text-xs text-brand-600 dark:text-brand-400">
          {t("speechRateHint")}
        </p>
        <SpeechRateControl />
      </section>
    </div>
  );
}
