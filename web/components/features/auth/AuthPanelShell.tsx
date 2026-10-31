import type { ReactNode } from "react";

type AuthPanelShellProps = {
  children: ReactNode;
};

export function AuthPanelShell({ children }: AuthPanelShellProps) {
  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden bg-[#070b14] px-4 py-10 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,rgba(56,189,248,0.22),transparent_55%),radial-gradient(ellipse_at_85%_80%,rgba(37,99,235,0.28),transparent_50%),radial-gradient(ellipse_at_60%_30%,rgba(14,165,233,0.12),transparent_45%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 top-1/4 h-[55%] w-[70%] -rotate-12 bg-[linear-gradient(110deg,transparent_20%,rgba(56,189,248,0.18)_45%,transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/5 bottom-0 h-[50%] w-[60%] rotate-6 bg-[linear-gradient(100deg,transparent_15%,rgba(59,130,246,0.2)_50%,transparent_80%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <div className="relative w-full max-w-md">
        <div
          aria-hidden
          className="absolute -left-1 -top-1 h-10 w-10 border-l-2 border-t-2 border-sky-400/70"
        />
        <div
          aria-hidden
          className="absolute -bottom-1 -right-1 h-10 w-10 border-b-2 border-r-2 border-sky-400/70"
        />

        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6 shadow-[0_0_60px_rgba(14,165,233,0.12)] backdrop-blur-xl sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-sky-500/5"
          />
          <div className="relative">{children}</div>
        </div>
      </div>
    </div>
  );
}
