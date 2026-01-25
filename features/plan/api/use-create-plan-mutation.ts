import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { PLAN_QUERY_KEY } from "../types";
import { PlanFormInput } from "../components/plan-form";

export function useCreatePlanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlanFormInput) => apiClient.post("plans", payload),
    onSuccess: () => {
      toast.success("Plan created successfully");
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
