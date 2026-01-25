import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { TermType, TRANSACTIONS_QUERY_KEY } from "../../types";
import { TransactionHelperRes } from "../../types";

export function useTransactionHelperQuery({ type }: { type: TermType }) {
  return useQuery({
    queryFn: async () => {
      const res = await apiClient.get<TransactionHelperRes>(
        "transactions/helpers",
        {
          type,
        },
      );
      return res.data;
    },
    queryKey: [TRANSACTIONS_QUERY_KEY, { type }],
  });
}
