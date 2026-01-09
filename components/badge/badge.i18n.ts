import { PlatformRoles } from "@/types/platform-roles.types";
import { useTranslations } from "next-intl";

export const GetBadgeText = (key: string) => {
  const t = useTranslations("badges");
  const badgeTranslations = {
    [PlatformRoles.SUPER_ADMIN]: t("roles.super_admin"),
    [PlatformRoles.ADMIN]: t("roles.admin"),
    [PlatformRoles.ACCOUNTANT]: t("roles.accountant"),
    [PlatformRoles.CALL_SERVICE]: t("roles.call_service"),
  };
  return badgeTranslations[key as keyof typeof badgeTranslations];
};
