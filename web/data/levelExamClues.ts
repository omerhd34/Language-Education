import type { CefrLevel } from "@/data/dashboardTopics";
import { examA1Clues } from "@/data/topics/exam/examA1";
import { examA2Clues } from "@/data/topics/exam/examA2";
import { examB1Clues } from "@/data/topics/exam/examB1";
import { examB2Clues } from "@/data/topics/exam/examB2";
import { examC1Clues } from "@/data/topics/exam/examC1";
import { examC2Clues } from "@/data/topics/exam/examC2";
import type { CrosswordCandidate } from "@/lib/crosswordBuilder";

const LEVEL_EXAM_CLUES: Record<CefrLevel, CrosswordCandidate[]> = {
  A1: examA1Clues,
  A2: examA2Clues,
  B1: examB1Clues,
  B2: examB2Clues,
  C1: examC1Clues,
  C2: examC2Clues,
};

export function getLevelExamClues(level: CefrLevel): CrosswordCandidate[] {
  return LEVEL_EXAM_CLUES[level];
}
