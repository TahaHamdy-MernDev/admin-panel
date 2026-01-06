"use client";

import DataTable from "@/components/data-table";
import { useTermsColumns } from "./columns";

export default function TermsDataTable() {
  return (
    <section className="data-table">
      <DataTable
        columns={useTermsColumns()}
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
