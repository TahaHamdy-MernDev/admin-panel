import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { LoginResponseData } from "../types";
import { LoginFormValues } from "../components/login-form";

export function useAuthLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginFormValues) =>
      apiClient.post<LoginResponseData>("login", payload, true).then((res) => {
        if (res.success && res.data) {
          return res.data;
        }
      }),
    onSuccess: () => {
      toast.success("Login successfully");
    },
    onError(error) {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
}
