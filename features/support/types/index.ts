import { PaginatedResult } from "@/types/api-types";

export type UserTicket = {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  profile_photo?: string | null;
};

export type TicketStatus = "open" | "pending" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export type Attachment = {
  id: number;
  url: string;
  name: string;
  type: string;
};

export type TicketMessage = {
  id: number;
  message: string;
  sender: UserTicket;
  createdAt: string;
  attachments?: Attachment[];
};

export type Ticket = {
  id: number;
  title?: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  createdBy: UserTicket;
  createdById: number;
  messages: TicketMessage[];
};
export const SUPPORT_TICKETS_QUERY_KEY = "support-tickets";
export type SupportTicketsResponse = PaginatedResult<Ticket>;
