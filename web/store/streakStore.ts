"use client";

import { create } from "zustand";
import { apiRequest } from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";
import type { StreakPayload } from "@/types/api";

type QueryStatus = "idle" | "loading" | "success" | "error";

type StreakState = {
  data: StreakPayload | undefined;
  status: QueryStatus;
  error: string | null;
  fetchStreak: (options?: { force?: boolean }) => Promise<void>;
  recordActivity: () => Promise<StreakPayload | null>;
  clear: () => void;
};

function authToken(): string | null {
  return useAuthStore.getState().accessToken;
}

export const useStreakStore = create<StreakState>((set, get) => ({
  data: undefined,
  status: "idle",
  error: null,

  fetchStreak: async (options) => {
    const token = authToken();
    if (!token) {
      set({ data: undefined, status: "idle", error: null });
      return;
    }

    if (!options?.force && get().status === "loading") {
      return;
    }
    if (!options?.force && get().status === "success" && get().data) {
      return;
    }

    set({ status: "loading", error: null });
    try {
      const data = await apiRequest<StreakPayload>("/streak", {
        accessToken: token,
      });
      set({ data, status: "success", error: null });
    } catch (error) {
      set({
        status: "error",
        error: error instanceof Error ? error.message : "Streak yüklenemedi",
      });
    }
  },

  recordActivity: async () => {
    const token = authToken();
    if (!token) {
      return null;
    }

    try {
      const data = await apiRequest<StreakPayload>("/streak", {
        method: "POST",
        accessToken: token,
      });
      set({ data, status: "success", error: null });
      return data;
    } catch {
      return null;
    }
  },

  clear: () => {
    set({ data: undefined, status: "idle", error: null });
  },
}));
