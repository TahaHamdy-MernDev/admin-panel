import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { globalQueryClient } from "@/components/providers/react-query";

export function useSendMessageMutation() {
  return useMutation({
    mutationFn: ({
      ticket_id,
      payload,
    }: {
      ticket_id: number;
      payload: FormData;
    }) => apiClient.postForm(`support-tickets/${ticket_id}/messages`, payload),
    onSuccess: () => {
      globalQueryClient.invalidateQueries({
        queryKey: ["support-tickets"],
        refetchType: "active",
      });
    },
    onError(error) {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
}
