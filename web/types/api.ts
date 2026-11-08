export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
  avatarUrl: string | null;
};

export type UpdateAvatarBody = {
  dataUrl: string;
};

export type UpdateAvatarPayload = {
  user: AuthUser;
};

export type UpdateProfileBody = {
  firstName: string;
  lastName: string;
  phone?: string;
};

export type UpdateProfilePayload = {
  user: AuthUser;
};

export type AuthPayload = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export type RegisterPayload = {
  email: string;
};

export type RegisterBody = {
  email: string;
  password: string;
  name?: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type VerifyEmailBody = {
  token: string;
};

export type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordPayload = {
  message: string;
};

export type VocabularyWordStatusValue = "KNOWN" | "LEARNING";

export type VocabularyStatusPayload = {
  statuses: Record<string, VocabularyWordStatusValue>;
  learningSelectedInPeriod: number;
  learnLimit: number;
  lockedUntil: string | null;
  learningSelectedToday: number;
  dailyLearnLimit: number;
  pendingStudyCount: number;
  pendingStudyWordIds: string[];
  lastLearnSelectedAt: string | null;
  learnUnlockedAt: string | null;
};

export type SetVocabularyWordStatusBody = {
  wordId: string;
  status: VocabularyWordStatusValue | null;
};

export type KnownVocabularyWord = {
  id: string;
  en: string;
  tr: string;
  categoryId: string;
  categoryTitle: string;
  statusSetAt: string;
};

export type KnownVocabularyWordsPayload = {
  words: KnownVocabularyWord[];
  count: number;
};

export type StudiedTodayVocabularyWord = KnownVocabularyWord & {
  status: "LEARNING";
  dueAt: string;
};

export type StudiedTodayVocabularyWordsPayload = {
  words: StudiedTodayVocabularyWord[];
  count: number;
  cancellableCount: number;
};

export type VocabularyQuizTypeProgress = {
  multiple_choice: boolean;
  fill_blank: boolean;
  listening: boolean;
};

export type VocabularyQuizWord = {
  id: string;
  en: string;
  tr: string;
  passed: VocabularyQuizTypeProgress;
};

export type VocabularyQuizQuestion = {
  wordId: string;
  prompt: string;
  options: string[];
};

export type VocabularyQuizPayload = {
  dueCount: number;
  words: VocabularyQuizWord[];
  questions: VocabularyQuizQuestion[];
  nextDueAt: string | null;
  earlyAccess: boolean;
  typeCounts: {
    multiple_choice: number;
    fill_blank: number;
    listening: number;
  };
};

export type VocabularyQuizAnswerBody = {
  wordId: string;
  answer: string;
  quizType: "multiple_choice" | "fill_blank" | "listening";
};

export type StartVocabularyStudyTimerPayload = {
  startedCount: number;
};

export type CancelVocabularyStudyTimerPayload = {
  cancelledCount: number;
};

export type VocabularyQuizAnswerPayload = {
  correct: boolean;
  expected: string;
  status: VocabularyWordStatusValue;
  dueCount: number;
  newlyKnown: boolean;
  passed: VocabularyQuizTypeProgress;
};

export type ProgressResetScope = "vocabulary" | "topics" | "all";

export type ProgressResetBody = {
  scope: ProgressResetScope;
};

export type ProgressResetPayload = {
  scope: ProgressResetScope;
  vocabularyDeleted: number;
  topicProgressDeleted: number;
  streakReset: boolean;
};

export type StreakPayload = {
  currentStreak: number;
  longestStreak: number;
  activeToday: boolean;
  lastActivityAt: string | null;
};
