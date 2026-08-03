/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import baseApi from "../Api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userProfile: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/profiles/me/",
        method: "PATCH",
        body: data,
        // Don't set Content-Type so browser adds multipart/form-data boundary for FormData
        formData: true,
      }),
      invalidatesTags: ["User"],
    }),

    // /admin_dashboard/users/?user_type=user
    allUsers: builder.query({
      query: (params) => {
        return {
          url: `/admin_dashboard/users/`,
          method: "GET",
          params: {
            user_type: "user",
            search: params?.search ?? "",
            page: params?.page ?? 1,
          },
        };
      },
      providesTags: ["User"],
    }),

    // /admin_dashboard/users/3/suspend/
    suspendUser: builder.mutation({
      query: (id) => ({
        url: `/admin_dashboard/users/${id}/suspend/`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // /admin_dashboard/users/3/activate/
    activateUser: builder.mutation({
      query: (id) => ({
        url: `/admin_dashboard/users/${id}/activate/`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // Suspend / Activate user
    toggleUserStatus: builder.mutation({
      query: ({ id, is_active }) => ({
        url: `/admin_dashboard/users/${id}/`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: ["User"],
    }),

    // /admin_dashboard/dashboard-anylizes/
    adminDashboardAnylizes: builder.query({
      query: () => ({
        url: "/admin_dashboard/dashboard-anylizes/",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

  }),
});

export const {
  useUserProfileQuery,
  useUpdateProfileMutation,
  useAllUsersQuery,
  useSuspendUserMutation,
  useActivateUserMutation,
  useToggleUserStatusMutation,
  useAdminDashboardAnylizesQuery
} = userApi;
