import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { TERMS_QUERY_KEY } from "../../types";
import { TermFormValues } from "../../components/terms/term-form";
export function useCreateTermMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TermFormValues) => apiClient.post("terms", payload),
    onSuccess: () => {
      toast.success("Term created successfully");
      queryClient.invalidateQueries({
        queryKey: [TERMS_QUERY_KEY],
        refetchType: "active",
      });
    },
    onError(error) {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
}
