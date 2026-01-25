import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { PaginatedResult } from "@/types/api-types";
import * as types from "../types";

export function useCountryQuery({ page, limit }: types.CurrencyParams) {
  return useQuery({
    queryKey: [types.CURRENCY_QUERY_KEY, { page, limit }],
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResult<types.CurrencyRow>>(
        "currency/get-all",
        {
          page,
          limit,
        },
      );
      return res.data;
    },
  });
}
