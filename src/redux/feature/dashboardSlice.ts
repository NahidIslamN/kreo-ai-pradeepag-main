"use client";

import baseApi from "../Api/baseApi";

export interface DashboardYearUserCount {
  month: number;
  count: number;
}

export interface DashboardSalesRepPerformance {
  id: number;
  full_name: string;
  visits_completed: number;
}

export interface DashboardWeeklyVisit {
  date: string;
  count: number;
}

export interface DashboardReportData {
  total_colonies: number;
  total_customers: number;
  active_sales_reps: number;
  overdue_visits: number;
  todays_visits: number;
  sales_rep_performance: DashboardSalesRepPerformance[];
  weekly_visits: DashboardWeeklyVisit[];
}

export interface DashboardReportResponse {
  success: boolean;
  message: string;
  data: DashboardReportData;
}

export interface ReminderItem {
  id: string;
  title: string;
  category: string;
  amount: string;
  due_date: string;
  repeat: string;
  status: string;
  notes: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ReminderMeta {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
}

export interface ReminderReportData {
  total_reminder: number;
  week_due: number;
  overdue: number;
  reminders: ReminderItem[];
  meta: ReminderMeta;
}

export interface ReminderReportResponse {
  success: boolean;
  message: string;
  meta: ReminderMeta;
  data: ReminderReportData;
}

export interface ReminderReportQueryParams {
  page?: number;
  limit?: number;
}

export interface SalesRepColony {
  id: number;
  name: string;
  region: string;
  status: "active" | "inactive";
  location_url: string;
  latitude: number;
  longitude: number;
}

export interface SalesRepUser {
  id: number;
  email: string;
  full_name: string;
  role: string;
  status: boolean;
  phone: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  image: string | null;
  last_activity: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface SalesRepresentativeData {
  id: number;
  company: number;
  user: SalesRepUser;
  colonies: SalesRepColony[];
  full_name: string;
  status: "active" | "inactive";
  email: string;
  phone: string;
}

export interface SalesRepresentativeMeta {
  total_items: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  per_page: number;
}

export interface SalesRepresentativesResponse {
  success: boolean;
  message: string;
  request_id: string;
  meta: SalesRepresentativeMeta;
  data: SalesRepresentativeData[];
}

export interface SalesRepresentativesQueryParams {
  page?: number;
  search?: string;
}

export interface ColonyAssignmentItem {
  id: number;
  name: string;
  region: string;
  status: "active" | "inactive" | "paused";
}

export interface ColoniesForAssignmentResponse {
  success: boolean;
  message: string;
  request_id: string;
  data: ColonyAssignmentItem[];
}

export interface CreateSalesRepresentativePayload {
  email: string;
  full_name: string;
  phone: string;
  password: string;
  status: "active" | "inactive";
  colony_ids: number[];
}

export interface CreateSalesRepresentativeResponse {
  success: boolean;
  message: string;
  request_id?: string;
  data?: SalesRepresentativeData;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // /transaction/dashboard-report
    dashboardReport: builder.query<DashboardReportResponse, void>({
      query: () => ({
        url: "/managements/company/dashboad/analytics/",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),

    // /reminder/reports
    reminderReport: builder.query<ReminderReportResponse, ReminderReportQueryParams | void>({
      query: (params) => ({
        url: "/reminder/reports",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
      }),
      providesTags: ["Dashboard"],
    }),

    // /managements/company/sales-representatives/
    salesRepresentatives: builder.query<SalesRepresentativesResponse, SalesRepresentativesQueryParams | void>({
      query: (params) => ({
        url: "/managements/company/sales-reps-for-assignment",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          search: params?.search ?? "",
        },
      }),
      providesTags: ["Dashboard"],
    }),

    // /managements/company/sales-representatives/
    createSalesRepresentative: builder.mutation<CreateSalesRepresentativeResponse, CreateSalesRepresentativePayload>({
      query: (data) => ({
        url: "/managements/company/sales-representatives/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Dashboard"],
    }),

// /managements/company/colonies-for-assignment/
   coloniesList: builder.query<ColoniesForAssignmentResponse, void>({
    query: () => ({
    url: "/managements/company/colonies-for-assignment/",
    method: "GET",
  }),
  providesTags: ["Dashboard"],
}),

// /notifications/custom/send/

    sendNotification: builder.mutation({
      query: (data) => ({
        url: "/notifications/custom/send/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Dashboard"],
    }),



    
  }),
});

export const { useDashboardReportQuery, useReminderReportQuery, useSalesRepresentativesQuery, useColoniesListQuery, useCreateSalesRepresentativeMutation, useSendNotificationMutation } = dashboardApi;
