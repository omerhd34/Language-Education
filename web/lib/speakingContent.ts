import { a1SpeakingSections } from "@/data/speakings/a1/sections";
import type { SpeakingLevel, SpeakingSection } from "@/data/speakings/types";

export const SPEAKING_LEVEL_ORDER: SpeakingLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

const sectionsById = new Map<string, SpeakingSection>(
  a1SpeakingSections.map((section) => [section.id, section]),
);

export const speakingSections: SpeakingSection[] = a1SpeakingSections;

export function getSpeakingSectionById(id: string): SpeakingSection | null {
  return sectionsById.get(id) ?? null;
}

export function getSpeakingSectionsByLevel(
  level: SpeakingLevel,
): SpeakingSection[] {
  return speakingSections.filter((section) => section.level === level);
}

export function getSpeakingSectionIndexInLevel(sectionId: string): number {
  const section = getSpeakingSectionById(sectionId);
  if (!section) {
    return 0;
  }
  const levelSections = getSpeakingSectionsByLevel(section.level);
  return levelSections.findIndex((item) => item.id === sectionId) + 1;
}

export function getSpeakingSpeakText(section: SpeakingSection): string {
  return section.model.messages.map((message) => message.text).join(" ");
}
