import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { CouponPaginatedRes, COUPONS_QUERY_KEY, Params } from "../types";
export function useCouponsQuery({ page, limit }: Params) {
  return useQuery({
    queryFn: async () => {
      const res = await apiClient.get<CouponPaginatedRes>("coupons", {
        page,
        limit,
      });
      return res.data;
    },
    queryKey: [COUPONS_QUERY_KEY, { page, limit }],
  });
}
