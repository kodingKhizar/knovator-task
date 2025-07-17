"use client";

import React, { useMemo, useState } from "react";
import { useGetAllJobsQuery } from "@/redux/jobsApi";
import Navbar from "./Navbar";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const JobsTable = () => {
  const { data, isLoading, error } = useGetAllJobsQuery();
  const jobs = data?.jobsData || [];

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (info) => (
          <div
            className="truncate max-w-xs sm:max-w-md"
            title={info.getValue()}
          >
            {info.getValue()}
          </div>
        ),
      },
      {
        accessorKey: "link",
        header: "Link",
        cell: (info) => (
          <a
            href={info.getValue()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 font-semibold transition"
          >
            View Job
          </a>
        ),
      },
    ],
    []
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: jobs,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(jobs.length / pagination.pageSize),
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40 text-indigo-600 font-semibold">
        Loading jobs...
      </div>
    );
  if (error)
    return (
      <div className="text-red-600 font-semibold p-4">
        Error loading jobs! Please try again.
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center sm:text-left">
          Available Jobs
        </h1>

        <div className="overflow-x-auto shadow-lg rounded-lg border border-indigo-200">
          <table className="min-w-full divide-y divide-indigo-200">
            <thead className="bg-indigo-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-indigo-900 font-semibold text-sm sm:text-base"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="bg-white divide-y divide-indigo-100">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-6 text-gray-500"
                  >
                    No jobs found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-indigo-50 transition cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-indigo-800 text-sm sm:text-base"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
          <div>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 mr-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>

          <div className="text-indigo-700 font-semibold">
            Page{" "}
            <span className="font-bold">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of <span className="font-bold">{table.getPageCount()}</span>
          </div>

          <div>
            <label
              htmlFor="pageSize"
              className="mr-2 text-indigo-700 font-semibold"
            >
              Jobs per page:
            </label>
            <select
              id="pageSize"
              value={pagination.pageSize}
              onChange={(e) =>
                setPagination((old) => ({
                  ...old,
                  pageSize: Number(e.target.value),
                  pageIndex: 0,
                }))
              }
              className="border border-indigo-300 rounded px-2 py-1"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobsTable;
