import baseApi from "../Api/baseApi";


export const categorieApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // /admin_dashboard/categories/?categoryfor=home
        allCategories: builder.query({
            query: ({ categoryfor }) => ({
                url: `/admin_dashboard/categories/?categoryfor=${categoryfor}`,
                method: "GET",
            }),
            providesTags: ["Categories"],
        }),

        // /admin_dashboard/categories/1/
        categoryById: builder.query({
            query: ({ id }) => ({
                url: `/admin_dashboard/categories/${id}/`,
                method: "GET",
            }),
            providesTags: ["Categories"],
        }),

        // /admin_dashboard/categories/
        createCategory: builder.mutation({
            query: (data) => ({
                url: `/admin_dashboard/categories/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Categories"],
        }),

        // /admin_dashboard/categories/2/
        updateCategory: builder.mutation({
            query: ({ id, data }) => ({
                url: `/admin_dashboard/categories/${id}/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Categories"],
        }),

        // /admin_dashboard/categories/1/
        deleteCategory: builder.mutation({
            query: ({ id }) => ({
                url: `/admin_dashboard/categories/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Categories"],
        }),


    }),
});

export const {
    useAllCategoriesQuery,
    useCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,

} = categorieApi;
