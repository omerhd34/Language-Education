import { a1ListeningSections } from "@/data/listenings/a1/sections";
import type { ListeningLevel, ListeningSection } from "@/data/listenings/types";

export const LISTENING_LEVEL_ORDER: ListeningLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

const sectionsById = new Map<string, ListeningSection>(
  a1ListeningSections.map((section) => [section.id, section]),
);

export const listeningSections: ListeningSection[] = a1ListeningSections;

export function getListeningSectionById(id: string): ListeningSection | null {
  return sectionsById.get(id) ?? null;
}

export function getListeningSectionsByLevel(
  level: ListeningLevel,
): ListeningSection[] {
  return listeningSections.filter((section) => section.level === level);
}

export function getListeningSectionIndexInLevel(sectionId: string): number {
  const section = getListeningSectionById(sectionId);
  if (!section) {
    return 0;
  }
  const levelSections = getListeningSectionsByLevel(section.level);
  return levelSections.findIndex((item) => item.id === sectionId) + 1;
}

export function getListeningSpeakText(section: ListeningSection): string {
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
