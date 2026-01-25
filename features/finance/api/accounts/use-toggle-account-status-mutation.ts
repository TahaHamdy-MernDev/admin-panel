import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ACCOUNTS_QUERY_KEY } from "../../types";

export function useToggleAccountStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) =>
      apiClient.patch(`accounts/${id}/status`),
    onSuccess: () => {
      toast.success("Account Status updated successfully");
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
