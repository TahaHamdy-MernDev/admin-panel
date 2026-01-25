import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { ACCOUNTS_QUERY_KEY } from "../../types";
import { AccountFormValues } from "../../components/accounts/account-form";

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
