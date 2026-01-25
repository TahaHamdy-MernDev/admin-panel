import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { PLAN_QUERY_KEY } from "../types";

export function useTogglePlanStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) =>
      apiClient.put(`plans/${code}/toggle-status`, {}),
    onSuccess: () => {
      toast.success("Plan updated successfully");
      queryClient.invalidateQueries({
        queryKey: [PLAN_QUERY_KEY],
        refetchType: "active",
      });
    },
    onError(error) {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
}
