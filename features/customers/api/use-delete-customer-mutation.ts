import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CUSTOMERS_QUERY_KEY } from "../types";

export function useDeleteCustomerMutation({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`users/customers/${id}`),
    onSuccess: () => {
      toast.success("Customer deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [CUSTOMERS_QUERY_KEY, { page, limit }],
        refetchType: "active",
      });
    },
    onError(error) {
      toast.error(error.message);
    },
  });
}
