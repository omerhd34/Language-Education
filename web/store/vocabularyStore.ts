"use client";

import { create } from "zustand";
import { apiRequest } from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";
import type {
  CancelVocabularyStudyTimerPayload,
  KnownVocabularyWordsPayload,
  ProgressResetBody,
  ProgressResetPayload,
  SetVocabularyWordStatusBody,
  StartVocabularyStudyTimerPayload,
  StudiedTodayVocabularyWordsPayload,
  VocabularyQuizAnswerBody,
  VocabularyQuizAnswerPayload,
  VocabularyQuizPayload,
  VocabularyStatusPayload,
  VocabularyWordStatusValue,
} from "@/types/api";

export type QueryStatus = "idle" | "loading" | "success" | "error";

export type QueryEntry<T> = {
  data: T | undefined;
  status: QueryStatus;
  error: string | null;
  fetchedAt: number | null;
};

function idleEntry<T>(): QueryEntry<T> {
  return {
    data: undefined,
    status: "idle",
    error: null,
    fetchedAt: null,
  };
}

type InvalidateTarget =
  | "status"
  | "quota"
  | "known"
  | "studiedToday"
  | "quiz"
  | "all";

type VocabularyState = {
  statusByCategory: Record<string, QueryEntry<VocabularyStatusPayload>>;
  learnQuota: QueryEntry<VocabularyStatusPayload>;
  knownWords: QueryEntry<KnownVocabularyWordsPayload>;
  studiedToday: QueryEntry<StudiedTodayVocabularyWordsPayload>;
  quiz: QueryEntry<VocabularyQuizPayload>;
  isAnsweringQuiz: boolean;
  isCompletingQuiz: boolean;
  isSettingWordStatus: boolean;
  isStartingTimer: boolean;
  isCancellingTimer: boolean;
  isResettingProgress: boolean;
  fetchStatus: (
    categoryId: string,
    options?: { force?: boolean },
  ) => Promise<void>;
  fetchLearnQuota: (options?: { force?: boolean }) => Promise<void>;
  fetchKnownWords: (options?: { force?: boolean }) => Promise<void>;
  fetchStudiedToday: (options?: { force?: boolean }) => Promise<void>;
  fetchQuiz: (options?: { force?: boolean }) => Promise<void>;
  invalidate: (targets: InvalidateTarget[]) => void;
  refetchInvalidated: () => Promise<void>;
  answerQuiz: (
    body: VocabularyQuizAnswerBody,
  ) => Promise<VocabularyQuizAnswerPayload>;
  completeQuiz: (body: {
    wordIds: string[];
  }) => Promise<{ knownCount: number }>;
  setWordStatus: (
    body: SetVocabularyWordStatusBody & { categoryId: string },
  ) => Promise<VocabularyStatusPayload>;
  startStudyTimer: () => Promise<StartVocabularyStudyTimerPayload>;
  cancelStudyTimer: () => Promise<CancelVocabularyStudyTimerPayload>;
  resetProgress: (body: ProgressResetBody) => Promise<ProgressResetPayload>;
  clearAll: () => void;
};

function authToken(): string | null {
  return useAuthStore.getState().accessToken;
}

function applyOptimisticStatus(
  draft: VocabularyStatusPayload,
  wordId: string,
  status: VocabularyWordStatusValue | null,
): VocabularyStatusPayload {
  const next: VocabularyStatusPayload = {
    ...draft,
    statuses: { ...draft.statuses },
    pendingStudyWordIds: [...(draft.pendingStudyWordIds ?? [])],
  };

  const withoutWord = next.pendingStudyWordIds.filter((id) => id !== wordId);

  if (status === null) {
    delete next.statuses[wordId];
    next.pendingStudyWordIds = withoutWord;
    next.pendingStudyCount = withoutWord.length;
    return next;
  }

  next.statuses[wordId] = status;
  if (status === "LEARNING") {
    const nextIds = next.pendingStudyWordIds.includes(wordId)
      ? next.pendingStudyWordIds
      : [...next.pendingStudyWordIds, wordId];
    next.pendingStudyWordIds = nextIds;
    next.pendingStudyCount = nextIds.length;
    return next;
  }

  next.pendingStudyWordIds = withoutWord;
  next.pendingStudyCount = withoutWord.length;
  return next;
}

const initialState = {
  statusByCategory: {} as Record<string, QueryEntry<VocabularyStatusPayload>>,
  learnQuota: idleEntry<VocabularyStatusPayload>(),
  knownWords: idleEntry<KnownVocabularyWordsPayload>(),
  studiedToday: idleEntry<StudiedTodayVocabularyWordsPayload>(),
  quiz: idleEntry<VocabularyQuizPayload>(),
  isAnsweringQuiz: false,
  isCompletingQuiz: false,
  isSettingWordStatus: false,
  isStartingTimer: false,
  isCancellingTimer: false,
  isResettingProgress: false,
};

export const useVocabularyStore = create<VocabularyState>((set, get) => ({
  ...initialState,

  fetchStatus: async (categoryId, options) => {
    const existing = get().statusByCategory[categoryId];
    if (
      !options?.force &&
      existing &&
      (existing.status === "loading" || existing.status === "success")
    ) {
      return;
    }

    set((state) => ({
      statusByCategory: {
        ...state.statusByCategory,
        [categoryId]: {
          data: existing?.data,
          status: "loading",
          error: null,
          fetchedAt: existing?.fetchedAt ?? null,
        },
      },
    }));

    try {
      const data = await apiRequest<VocabularyStatusPayload>(
        `/vocabulary/status?categoryId=${encodeURIComponent(categoryId)}`,
        { accessToken: authToken() },
      );
      set((state) => ({
        statusByCategory: {
          ...state.statusByCategory,
          [categoryId]: {
            data,
            status: "success",
            error: null,
            fetchedAt: Date.now(),
          },
        },
      }));
    } catch (error) {
      set((state) => ({
        statusByCategory: {
          ...state.statusByCategory,
          [categoryId]: {
            data: existing?.data,
            status: "error",
            error: error instanceof Error ? error.message : "error",
            fetchedAt: existing?.fetchedAt ?? null,
          },
        },
      }));
    }
  },

  fetchLearnQuota: async (options) => {
    const existing = get().learnQuota;
    if (
      !options?.force &&
      (existing.status === "loading" || existing.status === "success")
    ) {
      return;
    }

    set({
      learnQuota: {
        data: existing.data,
        status: "loading",
        error: null,
        fetchedAt: existing.fetchedAt,
      },
    });

    try {
      const data = await apiRequest<VocabularyStatusPayload>(
        "/vocabulary/status",
        { accessToken: authToken() },
      );
      set({
        learnQuota: {
          data,
          status: "success",
          error: null,
          fetchedAt: Date.now(),
        },
      });
    } catch (error) {
      set({
        learnQuota: {
          data: existing.data,
          status: "error",
          error: error instanceof Error ? error.message : "error",
          fetchedAt: existing.fetchedAt,
        },
      });
    }
  },

  fetchKnownWords: async (options) => {
    const existing = get().knownWords;
    if (
      !options?.force &&
      (existing.status === "loading" || existing.status === "success")
    ) {
      return;
    }

    set({
      knownWords: {
        data: existing.data,
        status: "loading",
        error: null,
        fetchedAt: existing.fetchedAt,
      },
    });

    try {
      const data = await apiRequest<KnownVocabularyWordsPayload>(
        "/vocabulary/known",
        { accessToken: authToken() },
      );
      set({
        knownWords: {
          data,
          status: "success",
          error: null,
          fetchedAt: Date.now(),
        },
      });
    } catch (error) {
      set({
        knownWords: {
          data: existing.data,
          status: "error",
          error: error instanceof Error ? error.message : "error",
          fetchedAt: existing.fetchedAt,
        },
      });
    }
  },

  fetchStudiedToday: async (options) => {
    const existing = get().studiedToday;
    if (
      !options?.force &&
      (existing.status === "loading" || existing.status === "success")
    ) {
      return;
    }

    set({
      studiedToday: {
        data: existing.data,
        status: "loading",
        error: null,
        fetchedAt: existing.fetchedAt,
      },
    });

    try {
      const data = await apiRequest<StudiedTodayVocabularyWordsPayload>(
        "/vocabulary/studied-today",
        { accessToken: authToken() },
      );
      set({
        studiedToday: {
          data,
          status: "success",
          error: null,
          fetchedAt: Date.now(),
        },
      });
    } catch (error) {
      set({
        studiedToday: {
          data: existing.data,
          status: "error",
          error: error instanceof Error ? error.message : "error",
          fetchedAt: existing.fetchedAt,
        },
      });
    }
  },

  fetchQuiz: async (options) => {
    const existing = get().quiz;
    if (
      !options?.force &&
      (existing.status === "loading" || existing.status === "success")
    ) {
      return;
    }

    set({
      quiz: {
        data: existing.data,
        status: "loading",
        error: null,
        fetchedAt: existing.fetchedAt,
      },
    });

    try {
      const data = await apiRequest<VocabularyQuizPayload>("/vocabulary/quiz", {
        accessToken: authToken(),
      });
      set({
        quiz: {
          data,
          status: "success",
          error: null,
          fetchedAt: Date.now(),
        },
      });
    } catch (error) {
      set({
        quiz: {
          data: existing.data,
          status: "error",
          error: error instanceof Error ? error.message : "error",
          fetchedAt: existing.fetchedAt,
        },
      });
    }
  },

  invalidate: (targets) => {
    const all = targets.includes("all");
    set((state) => {
      const next = { ...state };

      if (all || targets.includes("status")) {
        const statusByCategory: Record<
          string,
          QueryEntry<VocabularyStatusPayload>
        > = {};
        for (const [key, entry] of Object.entries(state.statusByCategory)) {
          statusByCategory[key] = {
            ...entry,
            status: "idle",
          };
        }
        next.statusByCategory = statusByCategory;
      }

      if (all || targets.includes("quota")) {
        next.learnQuota = { ...state.learnQuota, status: "idle" };
      }

      if (all || targets.includes("known")) {
        next.knownWords = { ...state.knownWords, status: "idle" };
      }

      if (all || targets.includes("studiedToday")) {
        next.studiedToday = { ...state.studiedToday, status: "idle" };
      }

      if (all || targets.includes("quiz")) {
        next.quiz = { ...state.quiz, status: "idle" };
      }

      return next;
    });
  },

  refetchInvalidated: async () => {
    const state = get();
    const tasks: Promise<void>[] = [];

    for (const [categoryId, entry] of Object.entries(state.statusByCategory)) {
      if (entry.status === "idle" && entry.fetchedAt !== null) {
        tasks.push(state.fetchStatus(categoryId, { force: true }));
      }
    }

    if (
      state.learnQuota.status === "idle" &&
      state.learnQuota.fetchedAt !== null
    ) {
      tasks.push(state.fetchLearnQuota({ force: true }));
    }
    if (
      state.knownWords.status === "idle" &&
      state.knownWords.fetchedAt !== null
    ) {
      tasks.push(state.fetchKnownWords({ force: true }));
    }
    if (
      state.studiedToday.status === "idle" &&
      state.studiedToday.fetchedAt !== null
    ) {
      tasks.push(state.fetchStudiedToday({ force: true }));
    }
    if (state.quiz.status === "idle" && state.quiz.fetchedAt !== null) {
      tasks.push(state.fetchQuiz({ force: true }));
    }

    await Promise.all(tasks);
  },

  answerQuiz: async (body) => {
    set({ isAnsweringQuiz: true });
    try {
      const data = await apiRequest<VocabularyQuizAnswerPayload>(
        "/vocabulary/quiz/answer",
        {
          method: "POST",
          body,
          accessToken: authToken(),
        },
      );
      get().invalidate(["all"]);
      void get().refetchInvalidated();
      return data;
    } finally {
      set({ isAnsweringQuiz: false });
    }
  },

  completeQuiz: async (body) => {
    set({ isCompletingQuiz: true });
    try {
      const data = await apiRequest<{ knownCount: number }>(
        "/vocabulary/quiz/complete",
        {
          method: "POST",
          body,
          accessToken: authToken(),
        },
      );
      get().invalidate(["all"]);
      void get().refetchInvalidated();
      return data;
    } finally {
      set({ isCompletingQuiz: false });
    }
  },

  setWordStatus: async ({ categoryId, wordId, status }) => {
    set({ isSettingWordStatus: true });
    const previous = get().statusByCategory[categoryId];
    const previousQuota = get().learnQuota;

    if (previous?.data) {
      set((state) => ({
        statusByCategory: {
          ...state.statusByCategory,
          [categoryId]: {
            ...previous,
            data: applyOptimisticStatus(previous.data!, wordId, status),
          },
        },
      }));
    }

    try {
      const data = await apiRequest<VocabularyStatusPayload>(
        "/vocabulary/status",
        {
          method: "PUT",
          body: { wordId, status } satisfies SetVocabularyWordStatusBody,
          accessToken: authToken(),
        },
      );

      set((state) => ({
        statusByCategory: {
          ...state.statusByCategory,
          [categoryId]: {
            data,
            status: "success",
            error: null,
            fetchedAt: Date.now(),
          },
        },
        learnQuota: {
          data: { ...data, statuses: {} },
          status: "success",
          error: null,
          fetchedAt: Date.now(),
        },
      }));

      get().invalidate(["known", "studiedToday", "quiz"]);
      void get().refetchInvalidated();
      return data;
    } catch (error) {
      set((state) => ({
        statusByCategory: {
          ...state.statusByCategory,
          [categoryId]: previous ?? idleEntry(),
        },
        learnQuota: previousQuota,
      }));
      throw error;
    } finally {
      set({ isSettingWordStatus: false });
    }
  },

  startStudyTimer: async () => {
    set({ isStartingTimer: true });
    try {
      const data = await apiRequest<StartVocabularyStudyTimerPayload>(
        "/vocabulary/study-timer",
        {
          method: "POST",
          body: {},
          accessToken: authToken(),
        },
      );
      get().invalidate(["status", "quota", "studiedToday", "quiz"]);
      void get().refetchInvalidated();
      return data;
    } finally {
      set({ isStartingTimer: false });
    }
  },

  cancelStudyTimer: async () => {
    set({ isCancellingTimer: true });
    try {
      const data = await apiRequest<CancelVocabularyStudyTimerPayload>(
        "/vocabulary/study-timer",
        {
          method: "DELETE",
          accessToken: authToken(),
        },
      );
      get().invalidate(["status", "quota", "studiedToday", "quiz"]);
      void get().refetchInvalidated();
      return data;
    } finally {
      set({ isCancellingTimer: false });
    }
  },

  resetProgress: async (body) => {
    set({ isResettingProgress: true });
    try {
      const data = await apiRequest<ProgressResetPayload>("/progress/reset", {
        method: "POST",
        body,
        accessToken: authToken(),
      });
      get().invalidate(["all"]);
      void get().refetchInvalidated();
      return data;
    } finally {
      set({ isResettingProgress: false });
    }
  },

  clearAll: () => {
    set({ ...initialState });
  },
}));
