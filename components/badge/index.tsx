// role-badge.cva.ts
import { cva } from "class-variance-authority";
import { GetBadgeText } from "./badge.i18n";

export const roleBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      role: {
        SUPER_ADMIN: "bg-red-100 text-red-800",
        ADMIN: "bg-blue-100 text-blue-800",
        ACCOUNTANT: "bg-emerald-100 text-emerald-800",
        CALL_SERVICE: "bg-amber-100 text-amber-800",
      },
    },
    defaultVariants: {
      role: "ADMIN",
    },
  }
);
const roleMap = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  ACCOUNTANT: "ACCOUNTANT",
  CALL_SERVICE: "CALL_SERVICE",
} as const;
export function Badge({ role }: { role: string }) {
  const label = GetBadgeText(role);

  return (
    <span
      className={roleBadgeVariants({
        role: roleMap[role as keyof typeof roleMap],
      })}
    >
      {label}
    </span>
  );
}
