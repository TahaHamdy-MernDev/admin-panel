import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { SUPPORT_TICKETS_QUERY_KEY, SupportTicketsResponse, Ticket } from "../types";

export function useSupportTicketsQuery({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  return useQuery({
    queryKey: [SUPPORT_TICKETS_QUERY_KEY, { page, limit }],
    queryFn: async () => {
      const res = await apiClient.get<SupportTicketsResponse>(
        "support-tickets",
        {
          page,
          limit,
        },
      );
      return res.data;
    },
  });
}

export function useSupportTicketQuery({
  id,
}: {
  id: number;
}) {
  return useQuery({
    queryKey: [SUPPORT_TICKETS_QUERY_KEY, { id }],
    queryFn: async () => {
      const res = await apiClient.get<Ticket>(`support-tickets/${id}`);
      return res.data;
    },
  });
}
