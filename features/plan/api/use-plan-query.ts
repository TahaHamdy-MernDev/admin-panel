import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

import { GetPlanRes, PLAN_QUERY_KEY } from "../types";

export function usePlanQuery(code: string) {
  return useQuery({
    queryKey: [PLAN_QUERY_KEY, code],
    queryFn: async () => {
      const res = await apiClient.get<GetPlanRes>(`plans/${code}`);
      return res.data;
    },
  });
}
