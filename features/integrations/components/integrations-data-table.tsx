"use client";
import DataTable from "@/components/data-table";
import { useIntegrationsColumns } from "./use-integrations-columns";
import { useSearchParams } from "next/navigation";
import { useIntegrationQuery } from "../api/use-integration-query";
function IntegrationsDataTable() {
  const page = Number(useSearchParams().get("page")) || 1;
  const limit = Number(useSearchParams().get("limit")) || 25;
  const columns = useIntegrationsColumns();
  const query_state = useIntegrationQuery({ page, limit });
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

export default IntegrationsDataTable;
