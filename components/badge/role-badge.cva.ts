import { cva } from "class-variance-authority";
import type { BadgeKey } from "./badge.types";
import { PlatformRoles } from "@/types/platform-roles.types";
import { SubscriptionsStatus } from "@/features/plan/constants";

export const roleBadgeVariants = cva(
  "inline-flex items-center rounded-full text-xs font-medium",
  {
    variants: {
      variant: {
        [PlatformRoles.SUPER_ADMIN]: "bg-red-100 text-red-800",
        [PlatformRoles.ADMIN]: "bg-blue-100 text-blue-800",
        [PlatformRoles.ACCOUNTANT]: "bg-emerald-100 text-emerald-800",
        [PlatformRoles.CALL_SERVICE]: "bg-amber-100 text-amber-800",

        [SubscriptionsStatus.ACTIVE]: "bg-green-100 text-green-800",
        [SubscriptionsStatus.TRIALING]: "bg-yellow-100 text-yellow-800",
        [SubscriptionsStatus.PAUSED]: "bg-red-100 text-red-800",
        [SubscriptionsStatus.CANCELED]: "bg-red-100 text-red-800",
        [SubscriptionsStatus.EXPIRED]: "bg-red-100 text-red-800",
      } satisfies Record<BadgeKey, string>,
      size: {
        xs: "px-1.5 py-0.5",
        sm: "px-2 py-1",
        md: "px-2.5 py-0.5",
        lg: "px-3 py-1.5",
      },
    },
  },
);
