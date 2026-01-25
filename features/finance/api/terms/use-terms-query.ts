import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { PaginatedResult } from "@/types/api-types";
import { TermsParams, TermRow, TERMS_QUERY_KEY } from "../../types";
export function useTermsQuery({ page, limit }: TermsParams) {
  return useQuery({
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResult<TermRow>>("terms", {
        page,
        limit,
      });
      return res.data;
    },
    queryKey: [TERMS_QUERY_KEY, { page, limit }],
  });
}
