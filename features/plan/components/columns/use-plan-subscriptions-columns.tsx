import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import { PlanSubscriptionRow } from "../../types";
import { DateCell } from "@/components/data-table/reusable/date-cell";
import { formatPrice } from "@/lib/format-price";
import { number } from "zod";
import { TranslatedBadge } from "@/components/badge";
// d: number;
//     start_at: string;
//     end_at: string;
//     note: string;
//     status: string;
//     wallet_tx?: {
//         amount: number;
//     };
//     tenant: {
//         owner: {
//             firstName: string;
//             lastName: string;
//             code: string;
//         };
//     };
export function usePlanSubscriptionsColumns(): ColumnDef<PlanSubscriptionRow>[] {
  const t = useTranslations("data-table.columns");
  return [
    {
      accessorKey: "id",
      header: "#",
      size: 50,
    },
    {
      id: "customer_info",
      accessorFn: (row) =>
        `${row?.tenant?.owner?.firstName} ${row?.tenant?.owner?.lastName} - ${row?.tenant?.owner?.phoneNumber}`,
      header: t("customers.customer_info"),
      cell: ({ row }) => {
        const owner = row?.original?.tenant?.owner;
        return (
          <div className="flex flex-col gap-0">
            {owner?.firstName} {owner?.lastName} <br />
            {owner?.phoneNumber}
          </div>
        );
      },
    },
    {
      accessorKey: "tenant.owner.code",
      header: t("code"),
    },
    {
      accessorKey: "start_at",
      header: t("plans.start_at"),
      cell: ({ row }) => {
        return <DateCell date={row.original.start_at} />;
      },
    },
    {
      id: "price",
      accessorKey: "wallet_tx?.amount",
      header: t("plans.price"),
      cell: ({ row }) => {
        const amount = row.original.wallet_tx?.amount;
        return <span>{formatPrice(amount)}</span>;
      },
    },
    {
      //status
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => {
        return <TranslatedBadge badgeKey={row.original.status} />;
      },
    },
    {
      accessorKey: "note",
      header: t("plans.note"),
      cell: ({ row }) => {
        return (
          <span>
            {row.original.note?.length > 50
              ? row.original.note.slice(0, 50) + "..."
              : row.original.note}
          </span>
        );
      },
    },
  ];
}
