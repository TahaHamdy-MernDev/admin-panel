import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { CURRENCY_QUERY_KEY } from "../types";

export function useToggleCountryStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) =>
      apiClient.put(`currency/${code}/toggle-status`, {}),
    onSuccess: () => {
      toast.success("Currency status updated successfully");
      queryClient.invalidateQueries({
        queryKey: [CURRENCY_QUERY_KEY],
        refetchType: "active",
      });
    },
    onError(error) {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
}
