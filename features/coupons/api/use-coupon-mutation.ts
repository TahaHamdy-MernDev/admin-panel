import { globalQueryClient } from "@/components/providers/react-query";
import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { COUPONS_QUERY_KEY } from "../types";
import { AddCouponFormValues } from "../components/coupon-form";

export function useCreateCouponMutation() {
  return useMutation({
    mutationFn: (payload: AddCouponFormValues) =>
      apiClient.post("coupons", payload),
    onSuccess: () => {
      globalQueryClient.invalidateQueries({
        queryKey: [COUPONS_QUERY_KEY],
        refetchType: "active",
      });
    },
  });
}
export function useToggleCouponStatusMutation() {
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.patch(`coupons/${id}/toggle-status`, {}),
    onSuccess: () => {
      globalQueryClient.invalidateQueries({
        queryKey: [COUPONS_QUERY_KEY],
        refetchType: "active",
      });
    },
  });
}
// delete
export function useDeleteCouponMutation() {
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`coupons/${id}`),
    onSuccess: () => {
      globalQueryClient.invalidateQueries({
        queryKey: [COUPONS_QUERY_KEY],
        refetchType: "active",
      });
    },
  });
}
