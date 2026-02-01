"use client";
import DataTable from "@/components/data-table";
import { useSearchParams } from "next/navigation";
import { usePlanSubscriptionsQuery } from "../../api/use-plan-subscriptions-query";
import { usePlanSubscriptionsColumns } from "../columns/use-plan-subscriptions-columns";
function PlanSubscriptionsDataTable({ code }: { code: string }) {
  const page = Number(useSearchParams().get("page")) || 1;
  const limit = Number(useSearchParams().get("limit")) || 25;
  const columns = usePlanSubscriptionsColumns();
  const query_state = usePlanSubscriptionsQuery({ page, limit, code });
  console.log(query_state.data);
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

export default PlanSubscriptionsDataTable;
