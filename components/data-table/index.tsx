"use client";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { PaginationBar } from "./core/paginations";
import TableActions from "./core/table-actions";
import MainTable from "./core/table";
import { useDebounce } from "@/hooks/use-debounce";

export type PaginationMeta = {
  current_page: number;
  total_pages: number;
  total_count: number;
  limit: number;
};
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: {
    items: TData[];
    meta: PaginationMeta;
  };
  right?: React.ReactNode;
}
export default function DataTable<TData, TValue>({
  columns,
  data,
  right,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedGlobalFilter = useDebounce(globalFilter, 50);
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    manualPagination: true,
    manualFiltering: false,
    pageCount: data.meta.total_pages,
    enableGlobalFilter: true,
    state: {
      globalFilter: debouncedGlobalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
  });
  return (
    <div className="space-y-2">
      <TableActions
        table={table}
        right={right}
        total_count={data.meta.total_count}
        current_limit={data.meta.limit}
      />
      <MainTable table={table} columns={columns} />
      <PaginationBar meta={data.meta} />
    </div>
  );
}
