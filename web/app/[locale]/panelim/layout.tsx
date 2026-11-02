import { PanelimGate } from "@/components/features/dashboard/PanelimGate";

export const instant = false;

export default function PanelimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PanelimGate>{children}</PanelimGate>;
}
