import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  // baseUrl: "https://enitiative.org/api",
  prepareHeaders: (headers) => {
    if (typeof window === "undefined") {
      return headers;
    }

    const token = localStorage.getItem("accessToken");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAutoLogout: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (typeof window !== "undefined" && result.error?.status === 401) {
    localStorage.removeItem("accessToken");
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax";

    const isOnAuthRoute = window.location.pathname.startsWith("/auth");

    if (!isOnAuthRoute) {
      window.location.href = "/auth";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAutoLogout,
  tagTypes: [
    "User",
    "Story",
    'Setting',
    'Dashboard',
    'Admin',
    'Colonies',
    'SubscriptionPlans',
    'Support',
    'Faq',
    'Template',
    'Categories'

  ],
  endpoints: () => ({}),
});

export default baseApi;
