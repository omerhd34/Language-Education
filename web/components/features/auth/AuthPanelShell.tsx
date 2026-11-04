import type { ReactNode } from "react";
import "./auth-panel.css";

type AuthPanelShellProps = {
  children: ReactNode;
};

export function AuthPanelShell({ children }: AuthPanelShellProps) {
  return (
    <div className="auth-shell">
      <div className="auth-shell-main">{children}</div>
    </div>
  );
}
