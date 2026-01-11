import { IncomeFormValues } from "@/app/[locale]/panel/finance/income/form";
import { apiClient } from "@/lib/api-client";
import { PaginatedResult } from "@/types/api-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TermType } from "./use-terms";
import { ExpenseFormValues } from "@/app/[locale]/panel/finance/expenses/form";
import { ACCOUNTS_QUERY_KEY } from "./use-accounts";
export type TransactionRow = {
  id: number;
  ref: string;
  amount: number;
  note?: string;
  date: string;
  created_at: string;
  term: {
    id: number;
    name: string;
  };
  account: {
    id: number;
    name: string;
  };
};

type Params = {
  page: number;
  limit: number;
  type: string;
};
export type TransactionHelperRes = {
  accounts: {
    id: number;
    name: string;
    balance: number;
    is_default: boolean;
  }[];
  terms: {
    id: number;
    name: string;
    type: TermType;
    requires_employee: boolean;
  }[];
  staff?: {
    id: number;
    firstName: string;
    lastName: string;
  }[];
};

export const TRANSACTIONS_QUERY_KEY = "transactions";
export function useTransactionHelperQuery({ type }: { type: TermType }) {
  return useQuery({
    queryFn: async () => {
      const res = await apiClient.get<TransactionHelperRes>(
        "transactions/helpers",
        {
          type,
        }
      );
      return res.data;
    },
    queryKey: [TRANSACTIONS_QUERY_KEY, { type }],
  });
}
export function useTransactionQuery({ page, limit, type }: Params) {
  return useQuery({
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResult<TransactionRow>>(
        "transactions",
        {
          page,
          limit,
          type,
        }
      );
      return res.data;
    },
    queryKey: [TRANSACTIONS_QUERY_KEY, { page, limit, type }],
  });
}
export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IncomeFormValues | ExpenseFormValues) =>
      apiClient.post("transactions", payload),
    onSuccess: () => {
      toast.success("Transaction created successfully");
      queryClient.invalidateQueries({
        queryKey: [TRANSACTIONS_QUERY_KEY],
        refetchType: "active",
      });
    },
    onError(error) {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
}
