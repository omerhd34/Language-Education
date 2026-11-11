import { clearExerciseDraftStorage } from "@/lib/exerciseDraftStorage";
import { clearLevelExamProgress } from "@/lib/levelExamProgressStorage";
import { clearPassedLevelExams } from "@/lib/levelExamStorage";
import { clearListeningProgressStorage } from "@/lib/listeningProgressStorage";
import { clearReadingProgressStorage } from "@/lib/readingProgressStorage";
import { clearSpeakingProgressStorage } from "@/lib/speakingProgressStorage";
import { clearTopicExamDrafts } from "@/lib/topicExamDraftStorage";
import { clearTopicProgressStorage } from "@/lib/topicProgressStorage";
import { clearVocabularyActivityStorage } from "@/lib/vocabularyActivityStorage";
import { clearLastVocabularyQuizResult } from "@/lib/vocabularyQuizResultStorage";
import { clearWritingProgressStorage } from "@/lib/writingProgressStorage";
import type { ProgressResetScope } from "@/validators/progress.schema";

function clearGrammarClientProgress(): void {
  clearPassedLevelExams();
  clearLevelExamProgress();
  clearTopicProgressStorage();
  clearExerciseDraftStorage();
  clearTopicExamDrafts();
}

function clearVocabularyClientProgress(): void {
  clearLastVocabularyQuizResult();
  clearVocabularyActivityStorage();
}

export function clearClientProgressForScope(scope: ProgressResetScope): void {
  switch (scope) {
    case "grammar":
      clearGrammarClientProgress();
      break;
    case "vocabulary":
      clearVocabularyClientProgress();
      break;
    case "reading":
      clearReadingProgressStorage();
      break;
    case "listening":
      clearListeningProgressStorage();
      break;
    case "writing":
      clearWritingProgressStorage();
      break;
    case "speaking":
      clearSpeakingProgressStorage();
      break;
    case "all":
      clearGrammarClientProgress();
      clearVocabularyClientProgress();
      clearReadingProgressStorage();
      clearListeningProgressStorage();
      clearWritingProgressStorage();
      clearSpeakingProgressStorage();
      break;
    default: {
      const _exhaustive: never = scope;
      return _exhaustive;
    }
  }
}
