import { LoginFormValues } from "@/app/[locale]/auth/login/page";
import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
type LoginResponseData = {
  user: {
    id: number;
    email: string;
    role: string;
  };
};

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
