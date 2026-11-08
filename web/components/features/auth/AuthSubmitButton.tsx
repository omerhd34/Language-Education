"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  pressed?: boolean;
  onPressAnimationEnd?: () => void;
};

export function AuthSubmitButton({
  children,
  className,
  pressed = false,
  onPressAnimationEnd,
  type = "submit",
  ...props
}: AuthSubmitButtonProps) {
  return (
    <button
      type={type}
      className={cn("auth-submit", pressed && "is-pressed", className)}
      onAnimationEnd={(event) => {
        if (event.animationName === "loginPress") {
          onPressAnimationEnd?.();
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
