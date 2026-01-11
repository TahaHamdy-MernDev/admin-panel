"use client";

import DataTable from "@/components/data-table";
import { useTransactionsColumns } from "./columns";
import { useTransactionQuery } from "@/hooks/api/finance/use-transaction";
import { useSearchParams } from "next/navigation";
import { TermType } from "@/hooks/api/finance/use-terms";

export default function TransactionsDataTable({ type }: { type: TermType }) {
  const searchParams = useSearchParams();
  const columns = useTransactionsColumns();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 25;
  const state = useTransactionQuery({ page, limit, type });
  return (
    <section className="data-table">
      <DataTable columns={columns} data={state.data} />
    </section>
  );
}
