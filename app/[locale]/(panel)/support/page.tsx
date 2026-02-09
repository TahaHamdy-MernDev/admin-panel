"use client";

import { useSupportTicketsQuery } from "@/features/support/api/use-support-query";
import TicketChat from "@/features/support/components/ticket-chat";
import TicketList from "@/features/support/components/ticket-list";
import { cn } from "@/lib/utils";

export default function SupportTicketsPage() {
  return (
    <div className="page">
      <div className="flex flex-col gap-4 p-4 md:grid md:grid-cols-12">
        <div className={cn("md:col-span-4", "hidden md:block", "block")}>
          <TicketList />
        </div>
        <div className={cn("md:col-span-8", "hidden md:block", "block")}>
          <TicketChat />
        </div>
      </div>
    </div>
  );
}
