import type { VocabularyWord } from "@/data/vocabulary/types";

function seedFromId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash % 1_000_000;
}

function getGeneratedImageUrl(word: Pick<VocabularyWord, "id" | "en">): string {
  const prompt = [
    "family-friendly educational flashcard illustration",
    "safe for children, wholesome, G-rated",
    `representing the English word or phrase "${word.en}"`,
    "simple clear composition, soft natural colors",
    "centered subject, no text, no letters, no watermark, no violence",
  ].join(", ");

  const params = new URLSearchParams({
    width: "640",
    height: "480",
    nologo: "true",
    seed: String(seedFromId(word.id)),
  });

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
}

export function getVocabularyWordImageUrl(
  word: Pick<VocabularyWord, "id" | "en" | "image">,
): string {
  const custom = word.image?.trim();
  if (custom) {
    return custom;
  }
  return getGeneratedImageUrl(word);
}

export function getVocabularyWordFallbackImageUrl(
  word: Pick<VocabularyWord, "id" | "en">,
): string {
  return getGeneratedImageUrl(word);
}
