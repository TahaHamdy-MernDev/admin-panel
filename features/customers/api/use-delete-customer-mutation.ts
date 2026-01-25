import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CUSTOMERS_QUERY_KEY } from "../types";

export function useDeleteCustomerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`users/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CUSTOMERS_QUERY_KEY],
        refetchType: "active",
      });
    },
    onError(error) {
      toast.error(error.message);
    },
  });
}
