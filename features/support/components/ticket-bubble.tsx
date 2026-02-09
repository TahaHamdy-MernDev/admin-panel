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
      className={cn("flex gap-2", isAdmin ? "justify-end" : "justify-start")}
    >
      {!isAdmin && <UserAvatar user={message.sender} />}

      <div
        className={cn(
          "max-w-[70%] rounded-lg px-3 py-2 text-sm",
          isAdmin ? "bg-primary text-primary-foreground" : "bg-primary/20",
        )}
      >
        {/* Text */}
        {message.message && (
          <p className="whitespace-pre-wrap">{message.message}</p>
        )}

        {/* Attachments */}
        {message.attachments?.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {message.attachments.map((file) => {
              const isImage = file.mimeType?.startsWith("image/");

              return isImage ? (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block overflow-hidden rounded-md border"
                >
                  <Image
                    src={file.url}
                    alt={file.name}
                    width={300}
                    height={300}
                    className="h-32 w-full object-cover"
                  />
                </a>
              ) : (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-md border bg-background px-2 py-3 text-xs hover:bg-muted"
                >
                  {file.name}
                </a>
              );
            })}
          </div>
        )}

        {/* Timestamp */}
        <span className="mt-1 block text-xs opacity-70">
          {new Date(message.createdAt).toLocaleString()}
        </span>
      </div>

      {isAdmin && <UserAvatar user={message.sender} />}
    </div>
  );
}

function UserAvatar({ user }: { user: UserTicket }) {
  console.log("user ", user);

  return (
    <Avatar className="h-8 w-8 ">
      <AvatarImage src={user?.profile_photo ?? ""} />
      <AvatarFallback>
        {user?.firstName?.[0]}
        {user?.lastName?.[0]}
      </AvatarFallback>
    </Avatar>
  );
}
