import { AccountFormValues } from "@/app/[locale]/panel/finance/accounts/form";
import { apiClient } from "@/lib/api-client";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type AccountRow = {
  account_id: number;
  name: string;
  balance: number;
  created_at: string;
  status: boolean;
};
type AccountsParams = {
  page: number;
  limit: number;
};

export const ACCOUNTS_QUERY_KEY = "accounts";
export function useAccountsQuery({ page, limit }: AccountsParams) {
  return useQuery({
    queryFn: async () => {
      const res = await apiClient.get<AccountRow[]>("accounts", {
        page,
        limit,
      });
      return res.data;
    },
    queryKey: [ACCOUNTS_QUERY_KEY, { page, limit }],
  });
}

export function useCreateAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AccountFormValues) =>
      apiClient.post("accounts", payload),
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({
        queryKey: [ACCOUNTS_QUERY_KEY],
        refetchType: "active",
      });
    },
    onError(error) {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
}