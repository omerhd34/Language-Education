"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useStreakStore } from "@/store/streakStore";

export function useStreakQuery() {
  const status = useAuthStore((state) => state.status);
  const data = useStreakStore((state) => state.data);
  const queryStatus = useStreakStore((state) => state.status);
  const fetchStreak = useStreakStore((state) => state.fetchStreak);

  useEffect(() => {
    if (status !== "authenticated") {
      useStreakStore.getState().clear();
      return;
    }
    void fetchStreak();
  }, [status, fetchStreak]);

  return {
    data,
    isLoading: queryStatus === "loading" || queryStatus === "idle",
    isError: queryStatus === "error",
    isSuccess: queryStatus === "success",
    refetch: () => fetchStreak({ force: true }),
  };
}
