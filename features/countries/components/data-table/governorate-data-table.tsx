"use client";
import DataTable from "@/components/data-table";
import { useGovernorateColumns } from "../columns/use-governorate-columns";
import { useSearchParams } from "next/navigation";
import { useGovernoratesQuery } from "../../api/use-governorates-query";
function GovernorateDataTable({ slug }: { slug: string }) {
  const page = Number(useSearchParams().get("page")) || 1;
  const limit = Number(useSearchParams().get("limit")) || 30;
  const columns = useGovernorateColumns();
  const query_state = useGovernoratesQuery({ slug, page, limit });
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

export default GovernorateDataTable;
