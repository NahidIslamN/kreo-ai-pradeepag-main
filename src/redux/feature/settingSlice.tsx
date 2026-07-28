import baseApi from "../Api/baseApi";


const settingSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // /admin_dashboard/legacy-policy/
    getLegacyPolicy: builder.query({
      query: () => `/admin_dashboard/legacy-policy/`,
      providesTags: ["Setting"],
    }),
    updateLegacyPolicy: builder.mutation({
      query: (data) => ({
        url: `/admin_dashboard/legacy-policy/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Setting"],
    }),



  }),
});

export const {
  useGetLegacyPolicyQuery,
  useUpdateLegacyPolicyMutation,
} = settingSlice;
