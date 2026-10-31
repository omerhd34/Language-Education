/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HiMoon, HiSun } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";

const toggleStyle = {
  width: 40,
  height: 40,
  minWidth: 40,
  minHeight: 40,
  maxWidth: 40,
  maxHeight: 40,
  boxSizing: "border-box",
} as const;

export function ThemeToggle() {
  const t = useTranslations("Theme");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-10!"
        aria-label={t("toggle")}
        disabled
        style={toggleStyle}
      />
    );
  }

  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="size-10!"
      aria-label={t("toggle")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      style={toggleStyle}
    >
      {isDark ? (
        <HiSun className="size-4" aria-hidden />
      ) : (
        <HiMoon className="size-4" aria-hidden />
      )}
    </Button>
  );
}
