import { ConfirmableSwitch } from "@/components/dialogs/confirmable-switch";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { CouponDiscountType, CouponRow } from "../types";
import { format } from "date-fns";
import { DateCell } from "@/components/data-table/reusable/date-cell";
import ToggleCouponStatus from "./toggle-coupon-status-dialog";
import DeleteCouponDialog from "./delete-coupon-dialog";

export function useCouponsColumns(): ColumnDef<CouponRow>[] {
  const t = useTranslations("data-table.columns");

  return [
    {
      accessorKey: "id",
      header: "#",
      size: 50,
      cell: ({ getValue }) => (
        <div className="flex items-center justify-start">
          {getValue<number>()}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: t("created_at"),
      cell: ({ getValue }) => (
        <DateCell date={getValue<string>()} format="yyyy-MM-dd HH:mm a" />
      ),
    },
    {
      accessorKey: "code",
      header: t("coupon.code"),
    },
    {
      accessorKey: "valid_from",
      header: t("coupon.validity"),
      cell: ({ row }) => {
        const from = row.original.valid_from;
        const to = row.original.valid_to;
        if (!from || !to) return "-";
        return (
          <span>
            {format(from, "yyyy-MM-dd")} <br />
            {format(to, "yyyy-MM-dd")}
          </span>
        );
      },
    },
    {
      accessorKey: "discount",
      header: t("coupon.discount"),

      cell: ({ row }) => {
        const discount = row.original.discount;
        const discountType = row.original.discountType;
        return `${discount} ${discountType === CouponDiscountType.FIXED ? "$" : "%"}`;
      },
    },
    {
      accessorKey: "usage_count",
      header: t("coupon.usage_count"),
    },
    {
      accessorKey: "usage_limit",
      header: t("coupon.usage_limit"),
    },
    {
      accessorKey: "is_active",
      header: t("status"),
      cell: ({ row }) => (
        <ToggleCouponStatus
          status={row.original.is_active}
          id={row.original.id.toString()}
        />
      ),
    },
    {
      header: t("actions"),
      cell: ({ row }) => (
        <div className="flex items-center justify-start">
          <DeleteCouponDialog id={row.original.id.toString()} />
        </div>
      ),
    },
  ];
}
