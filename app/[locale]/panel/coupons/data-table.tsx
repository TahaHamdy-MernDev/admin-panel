"use client";

import DataTable from "@/components/data-table";
import { useCouponsColumns } from "./columns";

export default function CouponsDataTable() {
  return (
    <section className="data-table">
      <DataTable
        columns={useCouponsColumns()}
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
