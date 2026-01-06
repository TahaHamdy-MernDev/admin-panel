"use client";
import DataTable from "@/components/data-table";
import { useAccountsColumns } from "./columns";

export default function AccountsDataTable() {
  return (
    <section className="data-table">
      <DataTable
        columns={useAccountsColumns()}
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
