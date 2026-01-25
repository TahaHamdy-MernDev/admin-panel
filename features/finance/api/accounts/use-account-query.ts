import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { PaginatedResult } from "@/types/api-types";
import { AccountRow, ACCOUNTS_QUERY_KEY, AccountsParams } from "../../types";
export function useAccountsQuery({ page, limit }: AccountsParams) {
  return useQuery({
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResult<AccountRow>>("accounts", {
        page,
        limit,
      });
      return res.data;
    },
    queryKey: [ACCOUNTS_QUERY_KEY, { page, limit }],
  });
}
