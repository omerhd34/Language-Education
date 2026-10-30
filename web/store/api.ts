import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "@/lib/api";
import { getApiBaseUrl } from "@/lib/api";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};

export type AuthPayload = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
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
  endpoints: (builder) => ({
    register: builder.mutation<AuthPayload, RegisterBody>({
      query: (body) => ({
        url: "/auth/register",
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
    me: builder.query<{ user: AuthUser }, void>({
      query: () => "/auth/me",
      transformResponse: (response: ApiResponse<{ user: AuthUser }>) => {
        if (!response.success) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useMeQuery } = api;
