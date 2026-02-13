"use client";
import DataTable from "@/components/data-table";
import { useDistrictsQuery } from "../../api/use-district-columns-query";
import { useSearchParams } from "next/navigation";
import { useDistrictColumns } from "../columns/use-district-columns";
function DistrictDataTable({ governorate_id }: { governorate_id: number }) {
  const page = Number(useSearchParams().get("page")) || 1;
  const limit = Number(useSearchParams().get("limit")) || 25;
  const columns = useDistrictColumns();
  const query_state = useDistrictsQuery({
    governorate_id,
    page,
    limit,
  });
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

export default DistrictDataTable;
