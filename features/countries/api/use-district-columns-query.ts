import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { PaginatedResult } from "@/types/api-types";
import * as types from "../types";

export function useDistrictsQuery({
  governorate_id,
  page,
  limit,
}: types.DistrictParams) {
  return useQuery({
    queryKey: [types.DISTRACTS_QUERY_KEY, { governorate_id, page, limit }],
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResult<types.DistrictRow>>(
        "governorates/districts",
        {
          governorate_id,
          page,
          limit,
        },
      );
      return res.data;
    },
  });
}
