import { a1ReadingSections } from "@/data/readings/a1/sections";
import type { ReadingLevel, ReadingSection } from "@/data/readings/types";

export const READING_LEVEL_ORDER: ReadingLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

const sectionsById = new Map<string, ReadingSection>(
  a1ReadingSections.map((section) => [section.id, section]),
);

export const readingSections: ReadingSection[] = a1ReadingSections;

export function getReadingSectionById(id: string): ReadingSection | null {
  return sectionsById.get(id) ?? null;
}

export function getReadingSectionsByLevel(
  level: ReadingLevel,
): ReadingSection[] {
  return readingSections.filter((section) => section.level === level);
}

export function getReadingSectionIndexInLevel(sectionId: string): number {
  const section = getReadingSectionById(sectionId);
  if (!section) {
    return 0;
  }
  const levelSections = getReadingSectionsByLevel(section.level);
  return levelSections.findIndex((item) => item.id === sectionId) + 1;
}

export function getReadingSpeakText(section: ReadingSection): string {
  const parts: string[] = [];
  if (section.body.intro) {
    parts.push(section.body.intro);
  }
  for (const paragraph of section.body.paragraphs) {
    parts.push(paragraph.en);
  }
  if (section.subsections) {
    for (const subsection of section.subsections) {
      for (const paragraph of subsection.paragraphs) {
        parts.push(paragraph.en);
      }
    }
  }
  return parts.join(" ");
}
