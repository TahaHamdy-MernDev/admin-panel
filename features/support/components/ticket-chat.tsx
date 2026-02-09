"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Paperclip, Send, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { statusVariant } from "./ticket-list";
import { useSearchParams } from "next/navigation";
import { useSupportTicketQuery } from "../api/use-support-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { RHFTextareaField } from "@/components/rhf-form/fields/rhf-textarea-field";
import { TicketBubble } from "./ticket-bubble";
import { QueryClient } from "@tanstack/react-query";
import { globalQueryClient } from "@/components/providers/react-query";
import { CurrentUser } from "@/features/auth/types";
import { useSendMessageMutation } from "../api/use-send-message-mutation";
import { toFormData } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function TicketChat() {
  const params = useSearchParams();
  const ticketId = params.get("ticket");

  if (!ticketId) {
    return (
      <Card className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Select a ticket to view details</p>
      </Card>
    );
  }

  return <TicketMessages ticketId={parseInt(ticketId)} />;
}

function TicketMessages({ ticketId }: { ticketId: number }) {
  const t = useTranslations();
  const mutation = useSendMessageMutation();
  const { data, isLoading } = useSupportTicketQuery({ id: ticketId });

  const [files, setFiles] = useState<File[]>([]);
  const form = useForm({
    defaultValues: {
      message: "",
    },
  });

  const message = form.watch("message");
  const isDisabled = !message?.trim() && files.length === 0;

  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return <TicketChatSkeleton />;
  }

  async function handleSubmit(data: { message: string }) {
    if (!data.message.trim() && files.length === 0) return;

    const formData = new FormData();
    formData.append("message", data.message);

    files.forEach((file) => {
      formData.append("attachments[]", file);
    });

    await mutation.mutateAsync({
      ticket_id: ticketId,
      payload: formData,
    });

    form.reset();
    setFiles([]);
  }

  const sender = globalQueryClient.getQueryData<CurrentUser>(["current-user"]);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{data?.title ?? "Support Ticket"}</CardTitle>
            <p className="text-xs text-muted-foreground">Ticket #{data?.id}</p>
          </div>
          <Badge variant={statusVariant(data?.status ?? "open")}>
            {data?.status}
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-1 flex-col p-0">
        <ScrollArea className="flex-1 p-4 max-h-[calc(100vh-25rem)]">
          <div className="space-y-4">
            {data?.messages?.map((message) => {
              console.log("message", message);
              return (
                <TicketBubble
                  key={message.id}
                  message={message}
                  isAdmin={message?.sender?.id === sender?.id}
                />
              );
            })}
          </div>
        </ScrollArea>

        <Separator />

        {files.length > 0 && (
          <div className="flex gap-2 overflow-x-auto border-t p-3">
            {files.map((file, i) => (
              <div
                key={i}
                className="relative w-24 shrink-0 rounded-md border p-1"
              >
                {file.type.startsWith("image/") ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    width={400}
                    height={400}
                    alt={file.name}
                    className="h-20 w-full rounded object-cover"
                  />
                ) : (
                  <div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
                    {file.name}
                  </div>
                )}

                <button
                  onClick={() => removeFile(i)}
                  className="absolute -right-2 -top-2 rounded-full bg-background p-1 shadow"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="border-t p-4">
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="relative flex items-end rounded-lg border bg-background px-2 py-1.5"
          >
            {/* Attachment */}
            <label className="mb-1 cursor-pointer pe-2">
              <Paperclip className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              <input type="file" multiple hidden onChange={onFilesSelected} />
            </label>

            {/* Textarea */}
            <RHFTextareaField
              control={form.control}
              name="message"
              placeholder={t("ticket.form.type_message")}
              rows={1}
              border="border-0"
              className="max-h-40 flex-1 resize-none border-0! bg-transparent p-0 text-sm focus-visible:ring-0 placeholder:opacity-40"
            />

            {/* Send */}
            <Button
              type="submit"
              size="icon"
              disabled={isDisabled}
              className="ms-2 h-8 w-8 rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

function TicketChatSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      {/* Header */}
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>

      <Separator />

      {/* Messages */}
      <CardContent className="flex flex-1 flex-col p-4 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => {
          const isAdmin = i % 2 === 0;

          return (
            <div
              key={i}
              className={cn(
                "flex gap-2",
                isAdmin ? "justify-end" : "justify-start",
              )}
            >
              {!isAdmin && <Skeleton className="h-8 w-8 rounded-full" />}

              <div className="space-y-2">
                <Skeleton className="h-4 w-64 rounded-lg" />
                <Skeleton className="h-3 w-32" />
              </div>

              {isAdmin && <Skeleton className="h-8 w-8 rounded-full" />}
            </div>
          );
        })}
      </CardContent>

      <Separator />

      {/* Input */}
      <div className="p-4">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </Card>
  );
}

export default TicketChat;
