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
import { Skeleton } from "@/components/ui/skeleton";

import { useTranslations } from "next-intl";
import Text from "@/components/typography";

function TicketList() {
  const t = useTranslations("tickets");
  const router = useRouter();
  const params = useSearchParams();
  const ticketId = params.get("ticket");

  const { data, isLoading } = useSupportTicketsQuery({
    page: 1,
    limit: 10,
  });

  if (isLoading) return <TicketListSkeleton />;

  function selectTicket(id: number) {
    router.push({
      pathname: "/support",
      query: { ticket: id.toString() },
    });
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          <Text as="p">{t("list.title")}</Text>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100svh-16rem)]">
          {data?.items?.map((ticket) => {
            const selected = ticket.id === Number(ticketId);

            return (
              <button
                key={ticket.id}
                onClick={() => selectTicket(ticket.id)}
                className={cn(
                  "relative w-full border-b px-4 py-3 text-left transition-colors",
                  "hover:bg-primary/20",
                  selected && "bg-primary/20",
                )}
              >
                {selected && (
                  <span className="absolute inset-y-0 start-0 w-1 bg-primary rounded-e" />
                )}

                <div className="flex items-start justify-between gap-2">
                  <p
                    className={cn(
                      "truncate",
                      selected ? "font-semibold" : "font-medium",
                    )}
                  >
                    {ticket.title || t("list.no_title")}
                  </p>

                  <Badge variant={priorityVariant(ticket.priority)}>
                    {t(`priority.${ticket.priority}`)}
                  </Badge>
                </div>

                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>#{ticket.id}</span>

                  <Badge
                    variant={statusVariant(ticket.status)}
                    className="font-normal"
                  >
                    {t(`status.${ticket.status}`)}
                  </Badge>
                </div>
              </button>
              // <button
              //   key={ticket.id}
              //   onClick={() => selectTicket(ticket.id)}
              //   className={cn(
              //     "w-full border-b p-4 text-left transition-colors",
              //     "hover:bg-primary/20",
              //     selected && "bg-primary/20",
              //   )}
              // >
              //   {/* Title + Priority */}
              //   <div className="flex items-start justify-between gap-2">
              //     <p className="truncate font-medium">
              //       {ticket.title || t("list.no_title")}
              //     </p>

              //     <Badge variant={priorityVariant(ticket.priority)}>
              //       {t(`priority.${ticket.priority}`)}
              //     </Badge>
              //   </div>

              //   {/* Meta + Status */}
              //   <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              //     <span>#{ticket.id}</span>

              //     <Badge
              //       variant={statusVariant(ticket.status)}
              //       className="font-normal"
              //     >
              //       {t(`status.${ticket.status}`)}
              //     </Badge>
              //   </div>
              // </button>
            );
          })}
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

function TicketListSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border-b p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>

              <div className="mt-2 flex items-center justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
export default TicketList;
