import { a1WritingSections } from "@/data/writings/a1/sections";
import type { WritingLevel, WritingSection } from "@/data/writings/types";

export const WRITING_LEVEL_ORDER: WritingLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

const sectionsById = new Map<string, WritingSection>(
  a1WritingSections.map((section) => [section.id, section]),
);

export const writingSections: WritingSection[] = a1WritingSections;

export function getWritingSectionById(id: string): WritingSection | null {
  return sectionsById.get(id) ?? null;
}

export function getWritingSectionsByLevel(
  level: WritingLevel,
): WritingSection[] {
  return writingSections.filter((section) => section.level === level);
}

export function getWritingSectionIndexInLevel(sectionId: string): number {
  const section = getWritingSectionById(sectionId);
  if (!section) {
    return 0;
  }
  const levelSections = getWritingSectionsByLevel(section.level);
  return levelSections.findIndex((item) => item.id === sectionId) + 1;
}

export function getWritingSpeakText(section: WritingSection): string {
  return section.model.messages.map((message) => message.text).join(" ");
}
