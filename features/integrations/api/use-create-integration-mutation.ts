import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { INTEGRATION_QUERY_KEY } from "../types";

export function useCreateIntegrationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData) =>
      apiClient.postForm("integrations/add-integration", payload),
    onSuccess: () => {
      toast.success("Integration created successfully");
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
