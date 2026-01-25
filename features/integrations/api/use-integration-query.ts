import { apiClient } from "@/lib/api-client";
import { PaginatedResult } from "@/types/api-types";
import { useQuery } from "@tanstack/react-query";
import {
  INTEGRATION_QUERY_KEY,
  IntegrationParams,
  IntegrationRow,
} from "../types";

export function useIntegrationQuery({ page, limit }: IntegrationParams) {
  return useQuery({
    queryKey: [INTEGRATION_QUERY_KEY, { page, limit }],
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResult<IntegrationRow>>(
        "integrations/get-integration-settings",
        {
          page,
          limit,
        },
      );
      return res.data;
    },
  });
}
