import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { GetPlanRes, PLAN_QUERY_KEY } from "../types";
import { toast } from "sonner";

export function useDeletePlanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      const res = await apiClient.delete<GetPlanRes>(`plans/${code}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Plan deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [PLAN_QUERY_KEY],
        refetchType: "active",
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
