import baseApi from "../Api/baseApi";


const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
        // /managements/company/subscription-plans/
    subscriptionPlans: builder.query({
      query: () => ({
        url: "/managements/company/subscription-plans/",
        method: "GET",
      }),
        providesTags: ["SubscriptionPlans"],
    }),
    // /managements/company/subscribe-with/1/
   subscribeWith: builder.mutation({
    query: ({ id, plan_duration }) => ({
        url: `/managements/company/subscribe-with/${id}/`,
        method: "POST",
        body: { plan_duration },
    }),
    invalidatesTags: ["SubscriptionPlans"],
}),

// /managements/support/messages/
supportMessages: builder.mutation({
    query: (formData: FormData) => ({
        url: `/managements/support/messages`,
        method: "POST",
        body: formData,
        formData: true,
    }),
}),

  }),
});

export const {
    useSubscriptionPlansQuery,
    useSubscribeWithMutation,
    useSupportMessagesMutation,
} = companyApi;
