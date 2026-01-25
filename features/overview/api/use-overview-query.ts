import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

import { OVERVIEW_QUERY_KEY, OverviewDTO } from "../types";

export function useOverviewQuery() {
  return useQuery({
    queryKey: [OVERVIEW_QUERY_KEY],
    queryFn: async () => {
      const res = await apiClient.get<OverviewDTO>("overview");
      return res.data;
    },
  });
}
