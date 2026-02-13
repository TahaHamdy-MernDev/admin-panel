"use client";
import DataTable from "@/components/data-table";
import { useCountryColumns } from "../columns/use-country-columns";
import { useSearchParams } from "next/navigation";
import { useCountryQuery } from "../../api/use-country-query";
function CountryDataTable() {
  const page = Number(useSearchParams().get("page")) || 1;
  const limit = Number(useSearchParams().get("limit")) || 25;
  const columns = useCountryColumns();
  const query_state = useCountryQuery({ page, limit });
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

export default CountryDataTable;
