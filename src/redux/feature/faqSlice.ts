import baseApi from "../Api/baseApi";


export const faqApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // /admin_dashboard/faqs/
        allFaqs: builder.query({
            query: () => ({
                url: "/admin_dashboard/faqs/",
                method: "GET",
            }),
            providesTags: ["Faq"],
        }),
        createFaq: builder.mutation({
            query: (data) => ({
                url: "/admin_dashboard/faqs/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Faq"],
        }),
        deleteFaq: builder.mutation({
            query: (id) => ({
                url: `/admin_dashboard/faqs/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Faq"],
        }),
        updateFaq: builder.mutation({
            query: ({ id, data }) => ({
                url: `/admin_dashboard/faqs/${id}/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Faq"],
        }),
        faqDetail: builder.query({
            query: (id) => ({
                url: `/admin_dashboard/faqs/${id}/`,
                method: "GET",
            }),
            providesTags: ["Faq"],
        }),


    }),
});

export const { useAllFaqsQuery, useCreateFaqMutation, useDeleteFaqMutation, useUpdateFaqMutation } = faqApi;
