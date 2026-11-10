export type {
  WritingExerciseBlock,
  WritingLevel,
  WritingModelChat,
  WritingSection,
} from "@/data/writings/types";

export {
  WRITING_LEVEL_ORDER,
  getWritingSectionById,
  getWritingSectionIndexInLevel,
  getWritingSectionsByLevel,
  getWritingSpeakText,
  writingSections,
} from "@/lib/writingContent";
