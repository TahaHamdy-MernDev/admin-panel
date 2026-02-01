import { useTranslations } from "next-intl";
import type { BadgeKey } from "./badge.types";
import { PlatformRoles } from "@/types/platform-roles.types";
import { SubscriptionsStatus } from "@/features/plan/constants";

export function useBadgeText() {
  const t = useTranslations("badges");
  const badgeTranslations = {
    [PlatformRoles.SUPER_ADMIN]: t("roles.super_admin"),
    [PlatformRoles.ADMIN]: t("roles.admin"),
    [PlatformRoles.ACCOUNTANT]: t("roles.accountant"),
    [PlatformRoles.CALL_SERVICE]: t("roles.call_service"),

    [SubscriptionsStatus.ACTIVE]: t("subs-status.active"),
    [SubscriptionsStatus.TRIALING]: t("subs-status.trialing"),
    [SubscriptionsStatus.PAUSED]: t("subs-status.paused"),
    [SubscriptionsStatus.CANCELED]: t("subs-status.canceled"),
    [SubscriptionsStatus.EXPIRED]: t("subs-status.expired"),
  } satisfies Record<BadgeKey, string>;

  return (key: BadgeKey) => badgeTranslations[key];
}
