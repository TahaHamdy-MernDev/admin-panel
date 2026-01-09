"use client";
import DataTable from "@/components/data-table";
import { useSearchParams } from "next/navigation";
import { useStaffColumns } from "./columns";
import { useStaffQuery } from "@/hooks/api/staff/use-staff";
export default function StaffDataTable() {
  const columns = useStaffColumns();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 25;

  const query_state = useStaffQuery({
    page,
    limit,
  });
  return (
    <section className="data-table">
      <DataTable
        query_state={query_state}
        columns={columns}
        data={query_state.data}
      />
    </section>
  );
}
