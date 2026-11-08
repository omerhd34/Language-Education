"use client";

import { create } from "zustand";
import { apiRequest } from "@/lib/apiClient";
import type {
  AuthPayload,
  AuthUser,
  ChangePasswordBody,
  ChangePasswordPayload,
  LoginBody,
  RegisterBody,
  RegisterPayload,
  UpdateAvatarPayload,
  UpdateProfileBody,
  UpdateProfilePayload,
  VerifyEmailBody,
} from "@/types/api";

export type AuthStatus = "unknown" | "authenticated" | "anonymous";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  status: AuthStatus;
  isLoggingIn: boolean;
  isRegistering: boolean;
  isVerifyingEmail: boolean;
  isRefreshing: boolean;
  isLoggingOut: boolean;
  isChangingPassword: boolean;
  isUpdatingAvatar: boolean;
  isUpdatingProfile: boolean;
  setCredentials: (payload: { user: AuthUser; accessToken: string }) => void;
  clearCredentials: () => void;
  setAnonymous: () => void;
  setUser: (user: AuthUser) => void;
  login: (body: LoginBody) => Promise<AuthPayload>;
  register: (body: RegisterBody) => Promise<RegisterPayload>;
  verifyEmail: (body: VerifyEmailBody) => Promise<AuthPayload>;
  refresh: () => Promise<AuthPayload>;
  changePassword: (body: ChangePasswordBody) => Promise<ChangePasswordPayload>;
  updateProfile: (body: UpdateProfileBody) => Promise<AuthUser>;
  logout: () => Promise<void>;
  uploadAvatar: (dataUrl: string) => Promise<AuthUser>;
  removeAvatar: () => Promise<AuthUser>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  status: "unknown",
  isLoggingIn: false,
  isRegistering: false,
  isVerifyingEmail: false,
  isRefreshing: false,
  isLoggingOut: false,
  isChangingPassword: false,
  isUpdatingAvatar: false,
  isUpdatingProfile: false,

  setCredentials: ({ user, accessToken }) => {
    set({
      user,
      accessToken,
      status: "authenticated",
    });
  },

  clearCredentials: () => {
    set({
      user: null,
      accessToken: null,
      status: "anonymous",
    });
  },

  setAnonymous: () => {
    set({
      user: null,
      accessToken: null,
      status: "anonymous",
    });
  },

  setUser: (user) => {
    set({ user });
  },

  login: async (body) => {
    set({ isLoggingIn: true });
    try {
      const data = await apiRequest<AuthPayload>("/auth/login", {
        method: "POST",
        body,
      });
      get().setCredentials({
        user: data.user,
        accessToken: data.accessToken,
      });
      return data;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  register: async (body) => {
    set({ isRegistering: true });
    try {
      return await apiRequest<RegisterPayload>("/auth/register", {
        method: "POST",
        body,
      });
    } finally {
      set({ isRegistering: false });
    }
  },

  verifyEmail: async (body) => {
    set({ isVerifyingEmail: true });
    try {
      const data = await apiRequest<AuthPayload>("/auth/verify-email", {
        method: "POST",
        body,
      });
      get().setCredentials({
        user: data.user,
        accessToken: data.accessToken,
      });
      return data;
    } finally {
      set({ isVerifyingEmail: false });
    }
  },

  refresh: async () => {
    set({ isRefreshing: true });
    try {
      const data = await apiRequest<AuthPayload>("/auth/refresh", {
        method: "POST",
        body: {},
      });
      get().setCredentials({
        user: data.user,
        accessToken: data.accessToken,
      });
      return data;
    } finally {
      set({ isRefreshing: false });
    }
  },

  changePassword: async (body) => {
    set({ isChangingPassword: true });
    try {
      return await apiRequest<ChangePasswordPayload>("/auth/me/password", {
        method: "POST",
        body,
        accessToken: get().accessToken,
      });
    } finally {
      set({ isChangingPassword: false });
    }
  },

  updateProfile: async (body) => {
    set({ isUpdatingProfile: true });
    try {
      const data = await apiRequest<UpdateProfilePayload>("/auth/me", {
        method: "PATCH",
        body,
        accessToken: get().accessToken,
      });
      set({ user: data.user });
      return data.user;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await apiRequest<{ message: string }>("/auth/logout", {
        method: "POST",
        body: {},
        accessToken: get().accessToken,
      });
    } finally {
      get().clearCredentials();
      set({ isLoggingOut: false });
    }
  },

  uploadAvatar: async (dataUrl) => {
    set({ isUpdatingAvatar: true });
    try {
      const data = await apiRequest<UpdateAvatarPayload>("/auth/me/avatar", {
        method: "PUT",
        body: { dataUrl },
        accessToken: get().accessToken,
      });
      set({ user: data.user });
      return data.user;
    } finally {
      set({ isUpdatingAvatar: false });
    }
  },

  removeAvatar: async () => {
    set({ isUpdatingAvatar: true });
    try {
      const data = await apiRequest<UpdateAvatarPayload>("/auth/me/avatar", {
        method: "DELETE",
        accessToken: get().accessToken,
      });
      set({ user: data.user });
      return data.user;
    } finally {
      set({ isUpdatingAvatar: false });
    }
  },
}));
