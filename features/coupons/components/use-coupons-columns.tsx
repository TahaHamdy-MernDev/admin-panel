import { ConfirmableSwitch } from "@/components/dialogs/confirmable-switch";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

export type CouponRow = {
  coupon_id: number;
  created_at: string;
  code: string;
  valid_from?: string;
  valid_to?: string;
  discount: number;
  usage_count: number;
  usage_limit: number;
  is_active: boolean;
};

export function useCouponsColumns(): ColumnDef<CouponRow>[] {
  const t = useTranslations("data-table.columns");

  return [
    {
      accessorKey: "coupon_id",
      header: "#",
    },
    {
      accessorKey: "created_at",
      header: t("created_at"),
    },
    {
      accessorKey: "code",
      header: t("coupon.code"),
    },
    {
      header: t("coupon.validity"),
      cell: ({ row }) => {
        const from = row.original.valid_from;
        const to = row.original.valid_to;
        if (!from || !to) return "-";
        return `${from} → ${to}`;
      },
    },
    {
      accessorKey: "discount",
      header: t("coupon.discount"),
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
      cell: ({ getValue }) => (
        <ConfirmableSwitch
          value={getValue<boolean>()}
          defaultValue={!!getValue<boolean>()}
          onConfirm={async (value) => {
            console.log(value);
            // await fetch("/api/feature", {
            //   method: "POST",
            //   body: JSON.stringify({ enabled: value }),
            // });
          }}
          feature_key="coupon_status"
        />
      ),
    },
  ];
}
