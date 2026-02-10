"use client";

import DataTable from "@/components/data-table";
import { useCouponsColumns } from "./use-coupons-columns";
import { useCouponsQuery } from "../api/use-coupon-query";
import { useSearchParams } from "next/navigation";

export default function CouponsDataTable() {
  const page = Number(useSearchParams().get("page")) || 1;
  const limit = Number(useSearchParams().get("limit")) || 25;
  const query_state = useCouponsQuery({ page, limit });
  const columns = useCouponsColumns();
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
