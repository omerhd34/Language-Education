"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { HiMoon, HiSun } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};
const useIsMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const t = useTranslations("Theme");
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const isDark = resolvedTheme === "dark";
  const Icon = isDark ? HiSun : HiMoon;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      disabled={!mounted}
      aria-label={t("toggle")}
      className={cn(className)}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? <Icon aria-hidden /> : null}
    </Button>
  );
}
