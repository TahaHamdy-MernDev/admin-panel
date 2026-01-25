"use client";

import DataTable from "@/components/data-table";
import { useTransactionsColumns } from "./transactions-columns";
import { useTransactionQuery } from "../../api/transactions/use-transaction-query";
import { useSearchParams } from "next/navigation";
import { TermType } from "../../types";

export default function TransactionsDataTable({ type }: { type: TermType }) {
  const searchParams = useSearchParams();
  const columns = useTransactionsColumns();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 25;
  const state = useTransactionQuery({ page, limit, type });
  return (
    <section className="data-table">
      <DataTable query_state={state} columns={columns} data={state.data} />
    </section>
  );
}
