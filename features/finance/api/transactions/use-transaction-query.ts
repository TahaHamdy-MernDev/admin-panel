import { apiClient } from "@/lib/api-client";
import { PaginatedResult } from "@/types/api-types";
import { useQuery } from "@tanstack/react-query";
import {
  TransactionRow,
  TransactionParams,
  TRANSACTIONS_QUERY_KEY,
} from "../../types";

export function useTransactionQuery({ page, limit, type }: TransactionParams) {
  return useQuery({
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResult<TransactionRow>>(
        "transactions",
        {
          page,
          limit,
          type,
        },
      );
      return res.data;
    },
    queryKey: [TRANSACTIONS_QUERY_KEY, { page, limit, type }],
  });
}
