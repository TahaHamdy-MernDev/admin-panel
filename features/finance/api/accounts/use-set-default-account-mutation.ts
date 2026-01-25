import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { ACCOUNTS_QUERY_KEY } from "../../types";
export function useSetDefaultAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) =>
      apiClient.patch(`accounts/${id}/default`),
    onSuccess: () => {
      toast.success("Account Set Default successfully");
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
