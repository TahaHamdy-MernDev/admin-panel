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
import { BadgeCheck, ChevronDown, User, UserIcon } from "lucide-react";

import { useAuthLogoutMutation } from "@/features/auth/api/use-logout-mutation";
import { Link } from "@/i18n/navigation";
import Text from "../typography";
import { cn } from "@/lib/utils";
import { TranslatedBadge } from "../badge";
import { useBadgeText } from "../badge/badge.i18n";

export default function UserHeader() {
  const t = useTranslations("header-user");
  const locale = useLocale();
  const { data } = useCurrentUserQuery();
  const { mutateAsync } = useAuthLogoutMutation();
  const fullName = [data?.firstName, data?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const initials =
    [data?.firstName, data?.lastName]
      .map((n) => n?.[0]?.toUpperCase())
      .filter(Boolean)
      .slice(0, 2)
      .join("") || "U";

  async function handleLogout() {
    await mutateAsync();
  }

  const getBadgeText = useBadgeText();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-start gap-2">
          <Button variant={"button_icon"} className="py-0 px-0">
            <Avatar className="px-0 py-0 h-full w-9">
              <AvatarImage 
                src={data?.profile_photo}
                alt="shadcn"
                className="p-0"
              />

              <AvatarFallback className="bg-transparent px-0 py-0">
                <UserIcon />
              </AvatarFallback>
            </Avatar>
          </Button>
          <div className="h-full flex flex-col items-start justify-start flex-1  text-start text-sm gap-0">
            <p className="text-sm">{fullName}</p>
            <p className="text-xs">
              {data?.platform_role && getBadgeText(data.platform_role)}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="shadow-none w-[150px]">
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
            <Text as="p" className="mb-1 text-sm">
              {t("logout")}
            </Text>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
