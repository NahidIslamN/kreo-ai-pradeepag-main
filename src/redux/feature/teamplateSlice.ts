import baseApi from "../Api/baseApi";


export const templateApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // /admin_dashboard/templates/?generation_type=video&category=discover&subcategory=1
        allTemplates: builder.query({
            query: ({ generation_type, category, subcategory }) => ({
                url: `/admin_dashboard/templates/?generation_type=${generation_type}&category=${category}&subcategory=${subcategory}`,
                method: "GET",
            }),
            providesTags: ["Template"],
        }),



        // /admin_dashboard/templates/b71f2695-13a7-4e11-a25e-9162d8af66d2/
        getTemplateById: builder.query({
            query: ({ id }) => ({
                url: `/admin_dashboard/templates/${id}/`,
                method: "GET",
            }),
            providesTags: ["Template"],
        }),

        // /admin_dashboard/templates/
        createTemplate: builder.mutation({
            query: (data) => ({
                url: `/admin_dashboard/templates/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Template"],
        }),

        // /admin_dashboard/templates/b71f2695-13a7-4e11-a25e-9162d8af66d2/
        updateTemplate: builder.mutation({
            query: ({ id, data }) => ({
                url: `/admin_dashboard/templates/${id}/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Template"],
        }),


        // /admin_dashboard/templates/b71f2695-13a7-4e11-a25e-9162d8af66d2/
        deleteTemplate: builder.mutation({
            query: ({ id }) => ({
                url: `/admin_dashboard/templates/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Template"],
        }),


        //------------------------------- AI DEVELOPER API TEAMPLATE ---------------------------------
        // /admin_dashboard/templates/config/
        templateConfig: builder.query({
            query: () => ({
                url: `/admin_dashboard/templates/config/`,
                method: "GET",
            }),
            providesTags: ["Template"],
        }),


        // /admin_dashboard/templates/
        allTemplatesForAdminDashboard: builder.query({
            query: () => ({
                url: `/admin_dashboard/templates/`,
                method: "GET",
            }),
            providesTags: ["Template"],
        }),




    }),
});

export const {
    useAllTemplatesQuery,
    useGetTemplateByIdQuery,
    useCreateTemplateMutation,
    useUpdateTemplateMutation,
    useDeleteTemplateMutation,
    useTemplateConfigQuery,
    useAllTemplatesForAdminDashboardQuery
} = templateApi;
