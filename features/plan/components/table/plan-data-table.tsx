"use client";
import DataTable from "@/components/data-table";
import { usePlansColumns } from "../columns/use-plan-columns";
import { useSearchParams } from "next/navigation";
import { usePlansQuery } from "../../api/use-plans-query";
function PlansDataTable() {
  const page = Number(useSearchParams().get("page")) || 1;
  const limit = Number(useSearchParams().get("limit")) || 25;
  const columns = usePlansColumns();
  const query_state = usePlansQuery({ page, limit });
  return (
    <section className="data-table">
      <DataTable
        columns={columns}
        query_state={query_state}
        data={query_state.data}
      />
    </section>
  );
}

export default PlansDataTable;
