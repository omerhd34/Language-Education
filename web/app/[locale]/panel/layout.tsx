import { PanelGate } from "@/components/features/dashboard/PanelGate";

export const instant = false;

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PanelGate>{children}</PanelGate>;
}
