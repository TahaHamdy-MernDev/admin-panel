import { toast } from "sonner";
import { TRANSACTIONS_QUERY_KEY } from "../../types";
import { apiClient } from "@/lib/api-client";
import { IncomeFormValues } from "../../components/income/income-form";
import { ExpenseFormValues } from "../../components/expenses/expenses-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
