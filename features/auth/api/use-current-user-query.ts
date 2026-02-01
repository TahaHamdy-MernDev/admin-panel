import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import * as types from "../types";

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: [types.CURRENT_USER_QUERY_KEY],
    queryFn: async () => {
      const res = await apiClient.get<types.CurrentUser>(
        "current-user",
        {},
        true,
      );
      return res.data;
    },
  });
}
