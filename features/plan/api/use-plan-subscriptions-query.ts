import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

import { GetPlanSubscriptionRes, PLAN_SUBSCRIPTIONS_QUERY_KEY } from "../types";

export function usePlanSubscriptionsQuery({
  code,
  page,
  limit,
}: {
  code: string;
  page: number;
  limit: number;
}) {
  return useQuery({
    queryKey: [PLAN_SUBSCRIPTIONS_QUERY_KEY, { code, page, limit }],
    queryFn: async ({}) => {
      const res = await apiClient.get<GetPlanSubscriptionRes>(
        `plans/${code}/subscriptions`,
        {
          page,
          limit,
        },
      );
      return res.data;
    },
  });
}
