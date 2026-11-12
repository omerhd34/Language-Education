import type { CefrLevel } from "./dashboardTopics";
import { examA1Clues } from "./exam/examA1";
import { examA2Clues } from "./exam/examA2";
import { examB1Clues } from "./exam/examB1";
import { examB2Clues } from "./exam/examB2";
import { examC1Clues } from "./exam/examC1";
import { examC2Clues } from "./exam/examC2";
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
