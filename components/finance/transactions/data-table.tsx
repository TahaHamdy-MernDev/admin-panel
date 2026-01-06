"use client";

import DataTable from "@/components/data-table";
import { useTransactionsColumns } from "./columns";

export default function TransactionsDataTable({
  type,
}: {
  type: "income" | "expenses";
}) {
  return (
    <section className="data-table">
      <DataTable
        columns={useTransactionsColumns()}
        data={{
          items: [],
          meta: {
            current_page: 1,
            total_pages: 1,
            total_count: 0,
            limit: 25,
          },
        }}
      />
    </section>
  );
}
