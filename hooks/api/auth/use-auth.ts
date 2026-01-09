import { LoginFormValues } from "@/app/[locale]/auth/login/page";
import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAuthLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginFormValues) =>
      apiClient.post("login", payload),
    onSuccess: () => {
      toast.success("Staff created successfully");
    },
    onError(error) {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
}
