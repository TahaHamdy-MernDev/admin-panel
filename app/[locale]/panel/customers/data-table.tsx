"use client";
import DataTable from "@/components/data-table";
import { useCustomersColumns } from "./columns";
import { useSearchParams } from "next/navigation";
const customers_data = [
  {
    customer_id: "CUS-7F2A1C9B",
    name: "John Doe",
    phone: "1234567890",
    created_at: "2020-01-01",
    status: true,
    login_history: [
      {
        ip: "127.0.0.1",
        device: "Chrome",
        created_at: "2020-01-01",
      },
    ],
    plan: {
      plan_id: 1,
      name: "Basic",
    },
  },
  {
    customer_id: "CUS-7F2A1C9C",
    name: "Jane Smith",
    phone: "0987654321",
    created_at: "2020-01-02",
    status: false,
    login_history: [
      {
        ip: "192.168.0.1",
        device: "Safari",
        created_at: "2020-01-02",
      },
    ],
    plan: {
      plan_id: 2,
      name: "Pro",
    },
  },
  {
    customer_id: "CUS-7F2A1C9D",
    name: "Bob Johnson",
    phone: "5555555555",
    created_at: "2020-01-03",
    status: true,
    login_history: [
      {
        ip: "10.0.0.1",
        device: "Firefox",
        created_at: "2020-01-03",
      },
    ],
    plan: {
      plan_id: 3,
      name: "Enterprise",
    },
  },
  {
    customer_id: "CUS-7F2A1C9E",
    name: "Alice Brown",
    phone: "6666666666",
    created_at: "2020-01-04",
    status: false,
    login_history: [
      {
        ip: "172.16.0.1",
        device: "Edge",
        created_at: "2020-01-04",
      },
    ],
    plan: {
      plan_id: 4,
      name: "Premium",
    },
  },
];
export default function CustomersDataTable() {
  const current_page = Number(useSearchParams().get("page")) || 1;
  const limit = Number(useSearchParams().get("limit")) || 25;
  return (
    <section className="data-table">
      <DataTable
        columns={useCustomersColumns()}
        data={{
          items: customers_data,
          meta: {
            current_page,
            total_pages: 1,
            total_count: customers_data.length,
            limit,
          },
        }}
      />
    </section>
  );
}
