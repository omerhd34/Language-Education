/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Bell,
  BookOpen,
  Check,
  ClipboardCheck,
  MonitorSmartphone,
} from "lucide-react";
import { SettingsSection } from "@/components/features/settings/SettingsSection";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { requestBrowserNotificationPermission } from "@/lib/browserNotification";
import { cn } from "@/lib/utils";

function NotificationRow({
  title,
  description,
  icon,
  checked,
  disabled,
  onCheckedChange,
  extra,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
  extra?: ReactNode;
}) {
  return (
    <li>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 disabled:cursor-not-allowed disabled:opacity-60",
          checked
            ? "border-sky-500/45 bg-sky-500/5 dark:border-sky-400/40 dark:bg-sky-400/10"
            : "border-border bg-background/80 hover:border-sky-500/45 hover:bg-sky-500/5 dark:bg-brand-950/40",
        )}
      >
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200">
          {icon}
        </span>
        <span className="min-w-0 flex-1 space-y-0.5">
          <span className="block text-sm font-medium text-brand-950 dark:text-brand-100">
            {title}
          </span>
          <span className="block text-xs leading-snug text-brand-600 dark:text-brand-400">
            {description}
          </span>
          {extra}
        </span>
        <span
          className={cn(
            "inline-flex size-6 shrink-0 items-center justify-center rounded-full transition-colors",
            checked
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
}

export function NotificationSettingsPanel() {
  const t = useTranslations("Settings");
  const { preferences, patchPreferences } = useNotificationPreferences();
  const [pushHint, setPushHint] = useState<
    "idle" | "unsupported" | "denied" | "granted"
  >("idle");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPushHint("unsupported");
      return;
    }
    if (Notification.permission === "granted") {
      setPushHint("granted");
    } else if (Notification.permission === "denied") {
      setPushHint("denied");
    }
  }, []);

  async function handleBrowserPushChange(checked: boolean) {
    if (!checked) {
      patchPreferences({ browserPush: false });
      return;
    }

    const permission = await requestBrowserNotificationPermission();
    if (permission === "unsupported") {
      setPushHint("unsupported");
      patchPreferences({ browserPush: false });
      return;
    }
    if (permission !== "granted") {
      setPushHint("denied");
      patchPreferences({ browserPush: false });
      return;
    }

    setPushHint("granted");
    patchPreferences({ browserPush: true });
  }

  return (
    <SettingsSection
      id="bildirimler"
      className="scroll-mt-24"
      titleId="settings-notifications"
      title={t("notifications")}
      description={t("notificationsHint")}
      icon={<Bell className="size-5" aria-hidden />}
    >
      <ul className="space-y-2" role="group" aria-label={t("notifications")}>
        <NotificationRow
          title={t("notificationsQuizReady")}
          description={t("notificationsQuizReadyHint")}
          icon={<ClipboardCheck className="size-3.5" aria-hidden />}
          checked={preferences.quizReady}
          onCheckedChange={(checked) =>
            patchPreferences({ quizReady: checked })
          }
        />

        <NotificationRow
          title={t("notificationsLearnMissed")}
          description={t("notificationsLearnMissedHint")}
          icon={<BookOpen className="size-3.5" aria-hidden />}
          checked={preferences.learnMissedDay}
          onCheckedChange={(checked) =>
            patchPreferences({ learnMissedDay: checked })
          }
        />

        <NotificationRow
          title={t("notificationsBrowserPush")}
          description={t("notificationsBrowserPushHint")}
          icon={<MonitorSmartphone className="size-3.5" aria-hidden />}
          checked={preferences.browserPush}
          disabled={pushHint === "unsupported"}
          onCheckedChange={(checked) => {
            void handleBrowserPushChange(checked);
          }}
          extra={
            pushHint === "unsupported" ? (
              <span className="block text-xs text-amber-700 dark:text-amber-300">
                {t("notificationsBrowserPushUnsupported")}
              </span>
            ) : pushHint === "denied" ? (
              <span className="block text-xs text-amber-700 dark:text-amber-300">
                {t("notificationsBrowserPushDenied")}
              </span>
            ) : null
          }
        />
      </ul>
    </SettingsSection>
  );
}
