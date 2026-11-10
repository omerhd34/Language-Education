"use client";

import { useTranslations } from "next-intl";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/Button";

type ListeningPlayButtonProps = {
  playId: string;
  activePlayId: string | null;
  onPlay: (playId: string) => void;
};

export function ListeningPlayButton({
  playId,
  activePlayId,
  onPlay,
}: ListeningPlayButtonProps) {
  const t = useTranslations("Listening");
  const isActive = activePlayId === playId;

  return (
    <Button
      type="button"
      size="sm"
      variant={isActive ? "default" : "outline"}
      onClick={() => onPlay(playId)}
    >
      {isActive ? (
        <VolumeX className="size-4" aria-hidden />
      ) : (
        <Volume2 className="size-4" aria-hidden />
      )}
      {isActive ? t("listenStop") : t("playClip")}
    </Button>
  );
}
