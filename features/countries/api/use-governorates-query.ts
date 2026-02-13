import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { PaginatedResult } from "@/types/api-types";
import * as types from "../types";

export function useGovernoratesQuery({
  slug,
  page,
  limit,
}: types.GovernorateParams) {
  return useQuery({
    queryKey: [types.GOVERNORATES_QUERY_KEY, { slug, page, limit }],
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResult<types.GovernorateRow>>(
        "governorates",
        {
          slug,
          page,
          limit,
        },
      );
      return res.data;
    },
  });
}
