"use client";
import DataTable from "@/components/data-table";
import { usePlansColumns } from "./columns";
import { useSearchParams } from "next/navigation";
const plans_data = {
  items: [
    {
      plan_id: "PLN-7F2A1C9B",
      created_at: "2020-01-01",
      name: "Basic",
      price: [{ amount: 99, currency: "USD" }],
      pilling: "Monthly",
      description: "All features",
      status: true,
    },
    {
      plan_id: "PLN-7F2A1C9C",
      created_at: "2020-01-02",
      name: "Pro",
      price: [{ amount: 199, currency: "USD" }],
      pilling: "Monthly",
      description: "All features",
      status: false,
    },
    {
      plan_id: "PLN-7F2A1C9D",
      created_at: "2020-01-03",
      name: "Enterprise",
      price: [{ amount: 499, currency: "USD" }],
      pilling: "Monthly",
      description: "All features",
      status: true,
    },
  ],
  meta: {
    current_page: 1,
    total_pages: 1,
    total_count: 250,
    limit: 25,
  },
};
function PlansDataTable() {
     const current_page = Number(useSearchParams().get("page")) || 1;
  const limit = Number(useSearchParams().get("limit")) || 25;
    return (
       <section className="data-table">
        <DataTable
          columns={usePlansColumns()}
          data={{
            ...plans_data,
            meta: { ...plans_data.meta, current_page, limit },
          }}
        />
      </section>
    );
}

export default PlansDataTable;