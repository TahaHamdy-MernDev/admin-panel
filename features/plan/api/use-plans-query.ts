import { apiClient } from "@/lib/api-client";
import { PaginatedResult } from "@/types/api-types";
import { useQuery } from "@tanstack/react-query";

import { PlanParams, PLAN_QUERY_KEY, PlanRow } from "../types";

export function usePlansQuery({ page, limit }: PlanParams) {
  return useQuery({
    queryKey: [PLAN_QUERY_KEY, { page, limit }],
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResult<PlanRow>>("plans/all", {
        page,
        limit,
      });
      return res.data;
    },
  });
}
