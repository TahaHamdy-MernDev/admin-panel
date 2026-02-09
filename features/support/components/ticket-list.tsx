"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "lucide-react";
import { useSupportTicketsQuery } from "../api/use-support-query";
import { TicketPriority, TicketStatus } from "../types";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

function TicketList() {
  const router = useRouter();
  const params = useSearchParams();
  const ticketId = params.get("ticket");
  const { data, isLoading } = useSupportTicketsQuery({ page: 1, limit: 10 });
  //set id to url
  if (isLoading) {
    return <div>Loading...</div>;
  }
  function selectTicket(id: number) {
    router.push({ pathname: "/support", query: { ticket: id.toString() } });
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" /> Support Tickets
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100svh-16rem)]">
          {data?.items?.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => selectTicket(ticket.id)}
              className={cn(
                "w-full border-b p-4 text-left hover:bg-muted",
                ticket.id === Number(ticketId) && "bg-muted",
              )}
            >
              <div className="flex items-center justify-between">
                <p className="truncate font-medium">
                  {ticket.title ?? "No title"}
                </p>
                <Badge variant={priorityVariant(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>#{ticket.id}</span>
                <Badge variant={statusVariant(ticket.status)}>
                  {ticket.status}
                </Badge>
              </div>
            </button>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
export function priorityVariant(p: TicketPriority) {
  if (p === "high") return "destructive";
  if (p === "medium") return "secondary";
  return "outline";
}

export function statusVariant(s: TicketStatus) {
  if (s === "open") return "default";
  if (s === "pending") return "secondary";
  return "outline";
}

export default TicketList;
