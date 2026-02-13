"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { PaginationBar } from "./core/pagination";
import TableActions from "./core/table-actions";
import MainTable from "./core/table";
import { PaginationMeta } from "@/types/api-types";
import ErrorState from "../shared/error";
import { useTranslations } from "next-intl";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?:
    | {
        items: TData[];
        meta: PaginationMeta;
      }
    | undefined;
  right?: React.ReactNode;

  query_state?: {
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    isFetching: boolean;
    refetch: () => void;
  };
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  right,
  query_state,
}: DataTableProps<TData, TValue>) {
   const t = useTranslations("common");
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data?.items && data.items.length > 0 ? data.items : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    manualPagination: true,
    manualFiltering: false,
    pageCount: data?.meta.total_pages || 0,
    enableGlobalFilter: true,
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
  });

  if (query_state?.isError) {
    return <ErrorState onRetry={query_state.refetch} />;
  }
  return (
    <div className="space-y-2 relative">
      <TableActions
        table={table}
        right={right}
        total_count={data?.meta.total_count || 0}
        current_limit={data?.meta.limit || 25}
        is_loading={query_state?.isLoading}
        t={t}
      />
      <MainTable
        table={table}
        columns={columns}
        is_loading={query_state?.isLoading}
        t={t}
      />
      <PaginationBar meta={data?.meta} />
    </div>
  );
}
