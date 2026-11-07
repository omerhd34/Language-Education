"use client";

import { useEffect } from "react";
import { useVocabularyStore, type QueryEntry } from "@/store/vocabularyStore";

function queryFlags<T>(entry: QueryEntry<T> | undefined) {
  const hasData = entry?.data !== undefined;
  const isError = entry?.status === "error";
  const isSuccess = entry?.status === "success" || (hasData && !isError);
  const isLoading =
    !entry ||
    (entry.status === "loading" && !hasData) ||
    (entry.status === "idle" && !hasData);
  const isFetching = entry?.status === "loading";

  return {
    data: entry?.data,
    isLoading,
    isFetching: Boolean(isFetching),
    isError: Boolean(isError),
    isSuccess: Boolean(isSuccess),
  };
}

export function useVocabularyStatusQuery(args: { categoryId: string }) {
  const categoryId = args.categoryId;
  const entry = useVocabularyStore(
    (state) => state.statusByCategory[categoryId],
  );
  const fetchStatus = useVocabularyStore((state) => state.fetchStatus);

  useEffect(() => {
    void fetchStatus(categoryId);
  }, [categoryId, fetchStatus]);

  return {
    ...queryFlags(entry),
    refetch: () => fetchStatus(categoryId, { force: true }),
  };
}

export function useVocabularyLearnQuotaQuery() {
  const entry = useVocabularyStore((state) => state.learnQuota);
  const fetchLearnQuota = useVocabularyStore((state) => state.fetchLearnQuota);

  useEffect(() => {
    void fetchLearnQuota();
  }, [fetchLearnQuota]);

  return {
    ...queryFlags(entry),
    refetch: () => fetchLearnQuota({ force: true }),
  };
}

export function useKnownVocabularyWordsQuery() {
  const entry = useVocabularyStore((state) => state.knownWords);
  const fetchKnownWords = useVocabularyStore((state) => state.fetchKnownWords);

  useEffect(() => {
    void fetchKnownWords();
  }, [fetchKnownWords]);

  return {
    ...queryFlags(entry),
    refetch: () => fetchKnownWords({ force: true }),
  };
}

export function useStudiedTodayVocabularyWordsQuery() {
  const entry = useVocabularyStore((state) => state.studiedToday);
  const fetchStudiedToday = useVocabularyStore(
    (state) => state.fetchStudiedToday,
  );

  useEffect(() => {
    void fetchStudiedToday();
  }, [fetchStudiedToday]);

  return {
    ...queryFlags(entry),
    refetch: () => fetchStudiedToday({ force: true }),
  };
}

export function useVocabularyQuizQuery() {
  const entry = useVocabularyStore((state) => state.quiz);
  const fetchQuiz = useVocabularyStore((state) => state.fetchQuiz);

  useEffect(() => {
    void fetchQuiz();
  }, [fetchQuiz]);

  return {
    ...queryFlags(entry),
    refetch: () => fetchQuiz({ force: true }),
  };
}
