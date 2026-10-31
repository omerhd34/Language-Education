import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "./api";

export type AuthStatus = "unknown" | "authenticated" | "anonymous";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  status: AuthStatus;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: "unknown",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.status = "authenticated";
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = "anonymous";
    },
    setAuthAnonymous: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = "anonymous";
    },
  },
});

export const { setCredentials, clearCredentials, setAuthAnonymous } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
