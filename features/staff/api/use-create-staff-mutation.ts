import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreatePlatformEmployeeFormValues } from "../components/create-staff-form";
import { STAFF_QUERY_KEY } from "../types";
export function useCreateStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePlatformEmployeeFormValues) =>
      apiClient.post("users/staff", payload),
    onSuccess: () => {
      toast.success("Staff created successfully");
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
