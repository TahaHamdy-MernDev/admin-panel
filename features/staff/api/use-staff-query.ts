import { apiClient } from "@/lib/api-client";
import { PaginatedResult } from "@/types/api-types";
import { useQuery } from "@tanstack/react-query";
import { StaffParams, STAFF_QUERY_KEY, StaffRow } from "../types";

export function useStaffQuery({ page, limit }: StaffParams) {
  return useQuery({
    queryKey: [STAFF_QUERY_KEY, { page, limit }],
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResult<StaffRow>>(
        "users/staff",
        {
          page,
          limit,
        },
      );
      return res.data;
    },
  });
}
