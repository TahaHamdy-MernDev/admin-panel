import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { PaginatedResult } from "@/types/api-types";
import { CUSTOMERS_QUERY_KEY, Params, CustomerRow } from "../types";
export function useCustomersQuery({ page, limit }: Params) {
  return useQuery({
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResult<CustomerRow>>(
        "users/customers",
        {
          page,
          limit,
        },
      );
      return res.data;
    },
    queryKey: [CUSTOMERS_QUERY_KEY, { page, limit }],
  });
}
