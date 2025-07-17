"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useAddJObsMutation, useGetJobsQuery } from "@/redux/jobsApi";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const Table = () => {
  const { data = { logs: [] }, isLoading, error, refetch } = useGetJobsQuery();
  const [getData, { isSuccess, isLoading: isFetching }] = useAddJObsMutation();

  // State for sorting and pagination
  const [sorting, setSorting] = useState([{ id: "timestamp", desc: true }]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess, refetch]);
  useEffect(() => {
    getData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorFn: (_row, index) => index + 1,
        id: "index",
        header: "#",
        enableSorting: false,
        cell: (info) => (
          <div className="text-gray-700 text-sm">{info.getValue()}</div>
        ),
        size: 40,
      },
      {
        accessorKey: "sourceUrl",
        header: "File Name",
        cell: (info) => (
          <a
            href={info.getValue()}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-indigo-700 hover:text-indigo-900 text-sm break-words max-w-xs inline-block"
            title={info.getValue()}
          >
            {info.getValue()}
          </a>
        ),
      },
      {
        accessorKey: "timestamp",
        header: "Import Date Time",
        cell: (info) => (
          <span className="text-gray-600 text-sm">
            {new Date(info.getValue()).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "totalFetched",
        header: "Total",
        cell: (info) => (
          <span className="font-semibold text-gray-800 text-sm">
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "newJobs",
        header: "New",
        cell: (info) => (
          <span className="font-semibold text-green-600 text-sm">
            {info.getValue() || 0}
          </span>
        ),
      },
      {
        accessorKey: "updatedJobs",
        header: "Update",
        cell: (info) => (
          <span className="font-semibold text-yellow-600 text-sm">
            {info.getValue() || 0}
          </span>
        ),
      },
      {
        accessorFn: (row) => row.failedJobs?.length || 0,
        id: "failedJobs",
        header: "Failed",
        cell: (info) => (
          <span className="font-semibold text-red-600 text-sm">
            {info.getValue()}
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: data.logs || [],
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      sorting: [{ id: "timestamp", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  });

  if (isLoading)
    return (
      <p className="text-center py-6 text-blue-600 font-semibold tracking-wide">
        Loading...
      </p>
    );
  if (error)
    return (
      <p className="text-center py-6 text-red-600 font-semibold tracking-wide">
        Failed to load jobs
      </p>
    );

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-4 py-3 text-left text-sm font-semibold text-indigo-900 cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.column.getSize() }}
                  >
                    <div className="flex items-center space-x-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-indigo-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        ),
                        desc: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-indigo-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        ),
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-indigo-50 transition cursor-pointer"
                title={`Source URL: ${row.original.sourceUrl}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 space-x-2">
        <button
          className="px-3 py-1 rounded border bg-indigo-600 text-white disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>

        <span className="text-sm text-gray-700">
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>

        <button
          className="px-3 py-1 rounded border bg-indigo-600 text-white disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>

        <select
          className="ml-auto px-2 py-1 border rounded"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20, 30, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Table;
