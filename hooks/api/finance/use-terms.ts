import { TermFormValues } from "@/app/[locale]/panel/finance/terms/form";
import { apiClient } from "@/lib/api-client";
import { PaginatedResult } from "@/types/api-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export enum TermType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export type TermRow = {
  id: number;
  name: string;
  type: (typeof TermType)[keyof typeof TermType];
  created_at: string;
};
type Params = {
  page: number;
  limit: number;
};
export const TERMS_QUERY_KEY = "terms";
export function useTermsQuery({ page, limit }: Params) {
  return useQuery({
    queryFn: async () => {
      const res = await apiClient.get<PaginatedResult<TermRow>>("terms", {
        page,
        limit,
      });
      return res.data;
    },
    queryKey: [TERMS_QUERY_KEY, { page, limit }],
  });
}

export function useCreateTermMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TermFormValues) => apiClient.post("terms", payload),
    onSuccess: () => {
      toast.success("Term created successfully");
      queryClient.invalidateQueries({
        queryKey: [TERMS_QUERY_KEY],
        refetchType: "active",
      });
    },
    onError(error) {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
}
