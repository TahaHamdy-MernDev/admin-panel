"use client";

import DataTable from "@/components/data-table";
import { useTermsColumns } from "./terms-columns";
import { useSearchParams } from "next/navigation";
import { useTermsQuery } from "../../api/terms/use-terms-query";

export default function TermsDataTable() {
  const searchParams = useSearchParams();
  const columns = useTermsColumns();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 25;
  const state = useTermsQuery({ page, limit });
  return (
    <section className="data-table">
      <DataTable query_state={state} columns={columns} data={state.data} />
    </section>
  );
}
