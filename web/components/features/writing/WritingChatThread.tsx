"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type {
  WritingChatMessage,
  WritingModelChat,
} from "@/data/writings/types";
import { speakDialogue, stopSpeaking } from "@/lib/speakText";
import { cn } from "@/lib/utils";

type WritingChatThreadProps = {
  model: WritingModelChat;
  showTranslation: boolean;
};

function contactInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return "?";
  }
  return trimmed.charAt(0).toLocaleUpperCase("en");
}

function toolbarButtonClass(outgoing: boolean, active?: boolean): string {
  return cn(
    "size-7 shrink-0 rounded-lg",
    active
      ? outgoing
        ? "bg-emerald-800/15 text-emerald-950 dark:bg-emerald-400/20 dark:text-emerald-50"
        : "bg-brand-100 text-brand-900 dark:bg-brand-800/60 dark:text-brand-50"
      : outgoing
        ? "text-emerald-950/75 hover:bg-emerald-900/10 dark:text-emerald-50/85 dark:hover:bg-emerald-950/35"
        : "text-brand-700/90 hover:bg-black/5 dark:text-brand-200 dark:hover:bg-white/10",
  );
}

export function WritingChatThread({
  model,
  showTranslation,
}: WritingChatThreadProps) {
  const t = useTranslations("Writing");
  const { contactName, contactStatus, messages } = model;
  const [listeningMessageId, setListeningMessageId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  function handleListenLine(message: WritingChatMessage) {
    const { id: messageId, text, sender } = message;
    if (listeningMessageId === messageId) {
      stopSpeaking();
      setListeningMessageId(null);
      return;
    }
    stopSpeaking();
    setListeningMessageId(messageId);
    const gender = sender === "me" ? ("female" as const) : ("male" as const);
    speakDialogue([{ text, gender }], "en-US", undefined, {
      onEnd: () => setListeningMessageId(null),
      onCancel: () => setListeningMessageId(null),
    });
  }

  function renderMessageToolbar(
    message: WritingChatMessage,
    outgoing: boolean,
  ) {
    const listening = listeningMessageId === message.id;

    return (
      <div
        className={cn(
          "mt-2 flex items-center justify-between gap-2 border-t pt-1.5",
          outgoing
            ? "border-emerald-900/10 dark:border-emerald-200/15"
            : "border-black/5 dark:border-white/10",
        )}
      >
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          aria-pressed={listening}
          aria-label={t("lineListenAria")}
          className={toolbarButtonClass(outgoing, listening)}
          onClick={() => handleListenLine(message)}
        >
          {listening ? (
            <VolumeX className="size-3.5" aria-hidden />
          ) : (
            <Volume2 className="size-3.5" aria-hidden />
          )}
        </Button>
        <span
          className={cn(
            "shrink-0 text-[10px] tabular-nums",
            outgoing
              ? "text-emerald-900/45 dark:text-emerald-100/50"
              : "text-brand-500/80 dark:text-brand-400/70",
          )}
        >
          {message.time}
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-[0_20px_50px_-24px_rgba(15,23,42,0.35)] ring-1 ring-black/5 sm:max-w-2xl dark:ring-white/10">
      <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white dark:bg-[#054640]">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold ring-1 ring-white/20"
          aria-hidden
        >
          {contactInitial(contactName)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold tracking-tight">{contactName}</p>
          {contactStatus ? (
            <p className="flex items-center gap-1.5 text-xs text-emerald-100/90">
              <span
                className="size-1.5 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_6px_rgba(110,231,183,0.8)]"
                aria-hidden
              />
              {contactStatus}
            </p>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "relative min-h-70 px-3 py-4 sm:px-5 sm:py-5",
          "bg-[#e7e0d4] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_0)] bg-size-[18px_18px]",
          "dark:bg-[#0f1419] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)]",
        )}
      >
        <ul className="flex flex-col gap-2.5">
          {messages.map((message) => {
            const outgoing = message.sender === "me";

            return (
              <li
                key={message.id}
                className={cn(
                  "flex w-full",
                  outgoing ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[min(100%,28rem)] rounded-2xl px-3 py-2 text-[16px] leading-snug shadow-sm",
                    outgoing
                      ? "bg-[#d9fdd3] text-[#111b21] dark:bg-emerald-900/55 dark:text-emerald-50"
                      : "bg-white text-[#111b21] dark:bg-brand-900/80 dark:text-brand-50",
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  {showTranslation && message.textTr ? (
                    <p
                      className={cn(
                        "mt-1.5 border-t pt-1.5 text-xs leading-relaxed",
                        outgoing
                          ? "border-emerald-900/10 text-emerald-950/75 dark:border-emerald-200/15 dark:text-emerald-100/80"
                          : "border-black/5 text-brand-600 dark:border-white/10 dark:text-brand-300",
                      )}
                    >
                      {message.textTr}
                    </p>
                  ) : null}
                  {renderMessageToolbar(message, outgoing)}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
