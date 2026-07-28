/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import baseApi from "../Api/baseApi";

interface User {
  id?: string | number;
  full_name?: string;
  email?: string;
  username?: string | null;
  image?: string;
  role?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("savedEmail");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setUser, setToken, logout, clearError } = authSlice.actions;

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/accounts/signup/",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: data,
      }),
    }),

    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/auth/otp-verify",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => {
        return {
          url: "auth/reset-password",
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("verificationToken")}`,
          },
        };
      },
    }),


  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
} = authApi;

export default authSlice.reducer;
