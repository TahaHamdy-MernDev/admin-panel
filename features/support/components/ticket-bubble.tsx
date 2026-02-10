import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TicketMessage, UserTicket } from "../types";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function TicketBubble({
  message,
  isAdmin,
}: {
  message: TicketMessage;
  isAdmin: boolean;
}) {
  return (
    <div
      className={cn(
        "flex w-full gap-2",
        isAdmin ? "justify-end" : "justify-start",
      )}
    >
      {/* User avatar (customer) */}
      {!isAdmin && <UserAvatar user={message.sender} />}

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm",
          isAdmin
            ? "bg-muted-foreground/15 rounded-tl-sm"
            : "bg-primary/15 text-primary-foreground rounded-tr-sm",
        )}
      >
        {/* Sender + time */}
        <div className="mb-1 flex items-center gap-2 text-xs opacity-70">
          <span className="font-medium">
            {message.sender?.firstName} {message.sender?.lastName}
          </span>
          <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
        </div>

        {/* Message text */}
        {message.message && (
          <p className="whitespace-pre-wrap leading-relaxed">
            {message.message}
          </p>
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {message.attachments.map((file) => {
              const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(file.url);

              return isImage ? (
                <Image
                  key={file.id}
                  src={file.url}
                  alt="attachment"
                  width={300}
                  height={300}
                  className="h-36 w-full rounded-md object-cover"
                />
              ) : (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-md border bg-background px-2 py-3 text-xs hover:bg-muted"
                >
                  Download file
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin avatar */}
      {isAdmin && <UserAvatar user={message.sender} />}
    </div>
  );
}

function UserAvatar({ user }: { user: UserTicket }) {
  return (
    <Avatar className="h-8 w-8 shrink-0">
      <AvatarImage src={user?.profile_photo ?? ""} />
      <AvatarFallback>
        {user?.firstName?.[0]}
        {user?.lastName?.[0]}
      </AvatarFallback>
    </Avatar>
  );
}
