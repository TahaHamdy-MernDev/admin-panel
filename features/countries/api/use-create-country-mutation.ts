import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import * as types from "../types";
export function useCreateCountryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fd: FormData) => apiClient.postForm("currency", fd),
    onSuccess: () => {
      toast.success("Currency created successfully");
      queryClient.invalidateQueries({
        queryKey: [types.CURRENCY_QUERY_KEY],
        refetchType: "active",
      });
    },
    onError(error) {
      console.error("Mutation error:", error);
      toast.error(error?.message ?? "Request failed");
    },
  });
}
