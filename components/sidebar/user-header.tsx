"use client";

import { useCurrentUserQuery } from "@/features/auth/api/use-current-user-query";
import { useLocale, useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeCheck, User } from "lucide-react";

import { useAuthLogoutMutation } from "@/features/auth/api/use-logout-mutation";
import { Link } from "@/i18n/navigation";
import Text from "../typography";

export default function UserHeader() {
  const t = useTranslations("header-user");
  const locale = useLocale();
  const { data } = useCurrentUserQuery();
  const { mutateAsync } = useAuthLogoutMutation();
  console.log(data);
  async function handleLogout() {
    await mutateAsync();
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="button_icon">
          {data?.profile_photo ? (
            <Avatar className="">
              <AvatarImage
                src={data?.profile_photo}
                alt="shadcn"
                className="w-full h-full rounded-none"
              />

              <AvatarFallback className="rounded-none">
                {data?.firstName[0].toUpperCase() +
                  data?.lastName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="shadow-none w-[200px]">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <div className="relative flex size-8 shrink-0 overflow-hidden rounded-full">
            <Avatar className="">
              <AvatarImage
                src={data?.profile_photo}
                alt="shadcn"
                className="w-full h-full rounded-none"
              />

              <AvatarFallback className="rounded-none">
                {data &&
                  data?.firstName[0].toUpperCase() +
                    data?.lastName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="grid flex-1 text-start text-sm leading-tight">
            <p className="truncate font-semibold">
              {data?.firstName + " " + data?.lastName}
            </p>
            <p className="text-muted-foreground truncate text-xs dark:text-white">
              {data?.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={true}>
            <Link href="/profile" className="flex items-center gap-2">
              {/* <BadgeCheck className="w-4 h-4 text-muted" /> */}
              <Text as="p" className="mb-1 text-sm">
                {t("profile")}
              </Text>
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleLogout}
            variant="destructive"
            className="flex items-center justify-between gap-2"
          >
            <Text as="p" className="mb-1 text-sm">{t("logout")}</Text>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
