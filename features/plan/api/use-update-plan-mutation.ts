import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { PLAN_QUERY_KEY } from "../types";
import { PlanFormInput } from "../schema";

export function useUpdatePlanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, code }: { payload: PlanFormInput; code: string }) =>
      apiClient.put(`plans/${code}/update`, payload),
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
