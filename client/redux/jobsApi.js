// store/jobsApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: `https://khizar-server.vercel.app/api/jobs`,
    

});

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery,


  
  tagTypes: ["Jobs"],
  endpoints: (builder) => ({
    addJObs: builder.mutation({
      query: (data) => ({
        url:"/trigger-import",
        method:"POST",

        body:data

      }), 
      invalidatesTags: ["Jobs"],
    }),
    getJobs: builder.query({
      query: () => ({
        url: "/import-history",
        method: "GET",

      }),
      providesTags: ["Jobs"],
    }),
    getAllJobs: builder.query({
      query: () => ({
        url: "/getAllJobs",
        method: "GET",

      }),
      providesTags: ["Jobs"],
    }),
   
  }),
});

export const { useGetJobsQuery, useAddJObsMutation, useGetAllJobsQuery } = jobsApi;
