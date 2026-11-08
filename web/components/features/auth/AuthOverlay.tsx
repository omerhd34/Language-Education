"use client";

import { KeyRound, LogIn, UserPlus } from "lucide-react";
import type { AuthMode } from "@/components/features/auth/auth-types";

type AuthOverlayCopy = {
  promoHasAccountTitle: string;
  promoHasAccountBody: string;
  promoLogin: string;
  promoForgotTitle: string;
  promoForgotBody: string;
  promoForgot: string;
  promoNoAccountTitle: string;
  promoNoAccountBody: string;
  promoRegister: string;
  promoHaveAccountTitle: string;
  promoHaveAccountBody: string;
};

type AuthOverlayProps = {
  brand: string;
  copy: AuthOverlayCopy;
  onSwitch: (mode: AuthMode) => void;
};

function OverlayForgot({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="overlay-forgot">
      <h2>{title}</h2>
      <p>{body}</p>
      <button type="button" className="overlay-btn" onClick={onAction}>
        <KeyRound className="size-4" aria-hidden />
        {actionLabel}
      </button>
    </div>
  );
}

export function AuthOverlay({ brand, copy, onSwitch }: AuthOverlayProps) {
  return (
    <div className="auth-overlay">
      <div className="auth-overlay-bg" />

      <div className="auth-overlay-panel auth-overlay-left">
        <span className="overlay-logo-text">{brand}</span>
        <h2>{copy.promoHasAccountTitle}</h2>
        <p>{copy.promoHasAccountBody}</p>
        <button
          type="button"
          className="overlay-btn"
          onClick={() => onSwitch("giris")}
        >
          <LogIn className="size-4" aria-hidden />
          {copy.promoLogin}
        </button>
        <OverlayForgot
          title={copy.promoForgotTitle}
          body={copy.promoForgotBody}
          actionLabel={copy.promoForgot}
          onAction={() => onSwitch("sifre")}
        />
      </div>

      <div className="auth-overlay-panel auth-overlay-right">
        <span className="overlay-logo-text">{brand}</span>
        <h2>{copy.promoNoAccountTitle}</h2>
        <p>{copy.promoNoAccountBody}</p>
        <button
          type="button"
          className="overlay-btn"
          onClick={() => onSwitch("kayit")}
        >
          <UserPlus className="size-4" aria-hidden />
          {copy.promoRegister}
        </button>
        <OverlayForgot
          title={copy.promoForgotTitle}
          body={copy.promoForgotBody}
          actionLabel={copy.promoForgot}
          onAction={() => onSwitch("sifre")}
        />
      </div>

      <div className="auth-overlay-panel auth-overlay-reset">
        <span className="overlay-logo-text">{brand}</span>
        <h2>{copy.promoHaveAccountTitle}</h2>
        <p>{copy.promoHaveAccountBody}</p>
        <div className="overlay-actions">
          <button
            type="button"
            className="overlay-btn"
            onClick={() => onSwitch("giris")}
          >
            <LogIn className="size-4" aria-hidden />
            {copy.promoLogin}
          </button>
          <button
            type="button"
            className="overlay-btn"
            onClick={() => onSwitch("kayit")}
          >
            <UserPlus className="size-4" aria-hidden />
            {copy.promoRegister}
          </button>
        </div>
      </div>
    </div>
  );
}
