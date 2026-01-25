import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { INTEGRATION_QUERY_KEY } from "../types";

export function useToggleIntegrationVisibilityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.put(`integrations/${id}/toggle-visibility`, {}),
    onSuccess: () => {
      toast.success("Integration updated successfully");
      queryClient.invalidateQueries({
        queryKey: [INTEGRATION_QUERY_KEY],
        refetchType: "active",
      });
    },
    onError(error) {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
}
