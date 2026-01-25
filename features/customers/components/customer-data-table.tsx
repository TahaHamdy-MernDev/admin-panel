"use client";
import DataTable from "@/components/data-table";
import { useCustomersColumns } from "./customer-columns";
import { useSearchParams } from "next/navigation";
import { useCustomersQuery } from "../api/use-customer-query";

export default function CustomersDataTable() {
  const columns = useCustomersColumns();
  const page = Number(useSearchParams().get("page")) || 1;
  const limit = Number(useSearchParams().get("limit")) || 25;
  const query_state = useCustomersQuery({ page, limit });

  return (
    <section className="data-table">
      <DataTable
        query_state={query_state}
        columns={columns}
        data={query_state.data}
      />
    </section>
  );
}
