import { PlatformRoles } from "@/types/platform-roles.types";
import { SubscriptionsStatus } from "@/features/plan/constants";

export type RoleBadgeKey =
  | PlatformRoles.SUPER_ADMIN
  | PlatformRoles.ADMIN
  | PlatformRoles.ACCOUNTANT
  | PlatformRoles.CALL_SERVICE;

export type SubBadgeKey =
  | SubscriptionsStatus.ACTIVE
  | SubscriptionsStatus.TRIALING
  | SubscriptionsStatus.PAUSED
  | SubscriptionsStatus.CANCELED
  | SubscriptionsStatus.EXPIRED;

export type BadgeKey = RoleBadgeKey | SubBadgeKey;
