import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardStatPanelHeaderProps = {
  children: ReactNode;
  trailing?: ReactNode;
  className?: string;
};

/** İstatistik kartlarında başlık yüksekliğini eşitlemek için (çubuk hizası). */
export function DashboardStatPanelHeader({
  children,
  trailing,
  className,
}: DashboardStatPanelHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-9 items-center justify-between gap-3",
        className,
      )}
    >
      {children}
      {trailing ? (
        <div className="flex shrink-0 items-center">{trailing}</div>
      ) : (
        <span className="w-px shrink-0 self-stretch opacity-0" aria-hidden />
      )}
    </div>
  );
}
