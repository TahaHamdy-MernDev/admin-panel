import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CUSTOMERS_QUERY_KEY } from "../types";

export function useChangeCustomerPasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      customer_id,
      password,
      confirm_password,
    }: {
      customer_id: string;
      password: string;
      confirm_password: string;
    }) =>
      apiClient.put(`users/customers/${customer_id}/change-password`, {
        password,
        confirm_password,
      }),
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
