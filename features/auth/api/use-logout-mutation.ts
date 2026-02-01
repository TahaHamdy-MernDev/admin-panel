import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export function useAuthLogoutMutation() {
  return useMutation({
    mutationFn: () => apiClient.post("logout", {}, true),
    onSuccess: () => {
      toast.success("Logout successfully");
      window.location.href = "/login";
    },
    onError(error) {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
}
