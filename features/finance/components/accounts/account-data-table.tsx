"use client";
import DataTable from "@/components/data-table";
import { useAccountsColumns } from "./account-columns";
import { useSearchParams } from "next/navigation";
import { useAccountsQuery } from "../../api/accounts/use-account-query";

export default function AccountsDataTable() {
  const searchParams = useSearchParams();
  const columns = useAccountsColumns();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 25;
  const state = useAccountsQuery({ page, limit });
  return (
    <section className="data-table">
      <DataTable query_state={state} columns={columns} data={state.data} />
    </section>
  );
}
