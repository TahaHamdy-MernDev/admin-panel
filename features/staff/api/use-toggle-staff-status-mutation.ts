import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { STAFF_QUERY_KEY } from "../types";
export function useToggleStaffStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.put(`users/staff/${id}/toggle-status`, {}),
    onSuccess: () => {
      toast.success("Staff updated successfully");
      queryClient.invalidateQueries({
        queryKey: [STAFF_QUERY_KEY],
        refetchType: "active",
      });
    },
    onError(error) {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
}
