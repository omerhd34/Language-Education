import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "@/lib/api";
import { getApiBaseUrl } from "@/lib/api";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
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

export type VocabularyWordStatusValue = "KNOWN" | "LEARNING";

export type VocabularyStatusPayload = {
  statuses: Record<string, VocabularyWordStatusValue>;
  learningSelectedInPeriod: number;
  learnLimit: number;
  lockedUntil: string | null;
  learningSelectedToday: number;
  dailyLearnLimit: number;
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

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth: { accessToken: string | null } };
      const token = state.auth.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["VocabularyStatus", "KnownVocabularyWords", "VocabularyQuiz"],
  endpoints: (builder) => ({
    register: builder.mutation<RegisterPayload, RegisterBody>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<RegisterPayload>) => {
        if (!response.success) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
    }),
    verifyEmail: builder.mutation<AuthPayload, VerifyEmailBody>({
      query: (body) => ({
        url: "/auth/verify-email",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<AuthPayload>) => {
        if (!response.success) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
    }),
    login: builder.mutation<AuthPayload, LoginBody>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<AuthPayload>) => {
        if (!response.success) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
    }),
    refresh: builder.mutation<AuthPayload, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
        body: {},
      }),
      transformResponse: (response: ApiResponse<AuthPayload>) => {
        if (!response.success) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        body: {},
      }),
      transformResponse: (response: ApiResponse<{ message: string }>) => {
        if (!response.success) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
    }),
    me: builder.query<{ user: AuthUser }, void>({
      query: () => "/auth/me",
      transformResponse: (response: ApiResponse<{ user: AuthUser }>) => {
        if (!response.success) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
    }),
    vocabularyStatus: builder.query<
      VocabularyStatusPayload,
      { categoryId: string }
    >({
      query: ({ categoryId }) =>
        `/vocabulary/status?categoryId=${encodeURIComponent(categoryId)}`,
      transformResponse: (response: ApiResponse<VocabularyStatusPayload>) => {
        if (!response.success) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
      providesTags: (_result, _error, arg) => [
        { type: "VocabularyStatus", id: arg.categoryId },
        { type: "VocabularyStatus", id: "QUOTA" },
      ],
    }),
    vocabularyLearnQuota: builder.query<VocabularyStatusPayload, void>({
      query: () => "/vocabulary/status",
      transformResponse: (response: ApiResponse<VocabularyStatusPayload>) => {
        if (!response.success) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
      providesTags: [{ type: "VocabularyStatus", id: "QUOTA" }],
    }),
    knownVocabularyWords: builder.query<KnownVocabularyWordsPayload, void>({
      query: () => "/vocabulary/known",
      transformResponse: (
        response: ApiResponse<KnownVocabularyWordsPayload>,
      ) => {
        if (!response.success) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
      providesTags: ["KnownVocabularyWords"],
    }),
    vocabularyQuiz: builder.query<VocabularyQuizPayload, void>({
      query: () => "/vocabulary/quiz",
      transformResponse: (response: ApiResponse<VocabularyQuizPayload>) => {
        if (!response.success) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
      providesTags: ["VocabularyQuiz"],
    }),
    answerVocabularyQuiz: builder.mutation<
      VocabularyQuizAnswerPayload,
      VocabularyQuizAnswerBody
    >({
      query: (body) => ({
        url: "/vocabulary/quiz/answer",
        method: "POST",
        body,
      }),
      transformResponse: (
        response: ApiResponse<VocabularyQuizAnswerPayload>,
      ) => {
        if (!response.success) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
      invalidatesTags: ["KnownVocabularyWords"],
    }),
    setVocabularyWordStatus: builder.mutation<
      VocabularyStatusPayload,
      SetVocabularyWordStatusBody & { categoryId: string }
    >({
      query: ({ wordId, status }) => ({
        url: "/vocabulary/status",
        method: "PUT",
        body: { wordId, status },
      }),
      transformResponse: (response: ApiResponse<VocabularyStatusPayload>) => {
        if (!response.success) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
      async onQueryStarted(
        { categoryId, wordId, status },
        { dispatch, queryFulfilled },
      ) {
        const patch = dispatch(
          api.util.updateQueryData(
            "vocabularyStatus",
            { categoryId },
            (draft) => {
              if (status === null) {
                delete draft.statuses[wordId];
                return;
              }
              draft.statuses[wordId] = status;
            },
          ),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData(
              "vocabularyStatus",
              { categoryId },
              () => data,
            ),
          );
          dispatch(
            api.util.updateQueryData("vocabularyLearnQuota", undefined, () => ({
              ...data,
              statuses: {},
            })),
          );
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [
        { type: "VocabularyStatus", id: "QUOTA" },
        "KnownVocabularyWords",
        "VocabularyQuiz",
      ],
    }),
    resetProgress: builder.mutation<ProgressResetPayload, ProgressResetBody>({
      query: (body) => ({
        url: "/progress/reset",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<ProgressResetPayload>) => {
        if (!response.success) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
      invalidatesTags: [
        "VocabularyStatus",
        "KnownVocabularyWords",
        "VocabularyQuiz",
      ],
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useMeQuery,
  useVocabularyStatusQuery,
  useVocabularyLearnQuotaQuery,
  useKnownVocabularyWordsQuery,
  useVocabularyQuizQuery,
  useAnswerVocabularyQuizMutation,
  useSetVocabularyWordStatusMutation,
  useResetProgressMutation,
} = api;
