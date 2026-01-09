import { CreatePlatformEmployeeFormValues } from "@/app/[locale]/panel/staff/form";

import { apiClient } from "@/lib/api-client";
import { PlatformRoles } from "@/types/platform-roles.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CountryCode } from "libphonenumber-js";
import { toast } from "sonner";
export type StaffRow = {
  id: string;
  firstName: string;
  lastName: string;
  code: string;
  email: string;
  phoneNumber: string;
  is_active: boolean;
  platform_role: PlatformRoles;
  country: CountryCode;
  createdAt: string;
};

type StaffParams = {
  page: number;
  limit: number;
};
export const STAFF_QUERY_KEY = "staff";
export function useStaffQuery({ page, limit }: StaffParams) {
  return useQuery({
    queryKey: [STAFF_QUERY_KEY, { page, limit }],
    queryFn: async () => {
      const res = await apiClient.get<StaffRow[]>("users/staff", {
        page,
        limit,
      });
      return res.data;
    },
  });
}

export function useCreateStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePlatformEmployeeFormValues) =>
      apiClient.post("users/staff", payload),
    onSuccess: () => {
      toast.success("Staff created successfully");
      queryClient.invalidateQueries({
        queryKey: [STAFF_QUERY_KEY],
        refetchType: "active",
      });
    },
    onError(error) {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
}

export function useToggleStaffStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.put(`users/staff/${id}/toggle-status`, {}),
    onSuccess: () => {
      toast.success("Staff updated successfully");
      queryClient.invalidateQueries({
        queryKey: [STAFF_QUERY_KEY],
        refetchType: "active",
      });
    },
    onError(error) {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
}
