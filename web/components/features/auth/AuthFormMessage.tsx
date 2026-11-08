import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthFormMessageProps = {
  children: string;
  tone?: "error" | "info";
  className?: string;
};

export function AuthFormMessage({
  children,
  tone = "error",
  className,
}: AuthFormMessageProps) {
  return (
    <div
      className={cn(
        "auth-form-message",
        tone === "info" && "is-info",
        className,
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      {tone === "error" ? (
        <CircleAlert className="size-4 shrink-0" aria-hidden />
      ) : null}
      <p>{children}</p>
    </div>
  );
}
