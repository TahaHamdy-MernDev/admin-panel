import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import { TableButton } from "@/components/ui/table-button";
import { Link } from "@/i18n/navigation";
import { Activity, Pen, Trash2 } from "lucide-react";
import { PlanRow } from "../../types";
import { DateCell } from "@/components/data-table/reusable/date-cell";
import { ToggleStatusDialog } from "../dialogs/toggle-status-dialog";
import { ToggleVisibilityDialog } from "../dialogs/toggle-visibility-dialog";
import ConfirmDeletePlansDialog from "../dialogs/delete-plans-dialog";

export function usePlansColumns(): ColumnDef<PlanRow>[] {
  const t = useTranslations("data-table.columns");
  return [
    {
      accessorKey: "code",
      header: "#",
    },
    {
      accessorKey: "created_at",
      header: t("created_at"),
      cell: ({ row }) => <DateCell date={row?.original?.created_at} />,
    },
    {
      accessorKey: "name",
      header: t("plans.name"),
    },
    {
      accessorKey: "prices",
      header: t("plans.price"),
      cell: ({ row }) => {
        const prices = row.getValue("prices") as {
          price_egp: number;
          price_usd: number;
        }[];

        if (prices.length === 0) {
          return <span className="text-muted-foreground font-medium">--</span>;
        }

        const formatPrice = (price: number) => {
          return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(price);
        };

        if (prices.length === 1) {
          return (
            <div className="font-medium">
              <span>{formatPrice(prices[0].price_egp)}</span>
              {"/"}
              <span>{formatPrice(prices[0].price_usd)}</span>
            </div>
          );
        }

        return (
          <div className="space-y-1">
            {prices.map((price, index) => (
              <div key={index} className="font-medium text-xs">
                <span className="text-green-600">
                  £{formatPrice(price.price_egp)}
                </span>
                <span className="mx-1 text-muted-foreground">/</span>
                <span className="text-blue-600">
                  ${formatPrice(price.price_usd)}
                </span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "billing_type",
      header: t("plans.pilling"),
    },
    {
      accessorKey: "is_active",
      header: t("status"),
      cell: ({ row }) => {
        const status = row.getValue("is_active") as boolean;
        return (
          <ToggleStatusDialog status={status} code={row.getValue("code")} />
        );
      },
    },
    {
      accessorKey: "is_visible",
      header: t("visible"),
      cell: ({ row }) => {
        const status = row.getValue("is_visible") as boolean;
        return (
          <ToggleVisibilityDialog status={status} code={row.getValue("code")} />
        );
      },
    },
    {
      id: "actions",
      header: t("actions"),
      cell: ({ row }) => (
        <div className="flex flex-row items-center justify-center gap-1 space-x-1">
          <Link href={`/plans/${row.original.code.toLowerCase()}/edit`}>
            <TableButton variant={"table_icon_edit"}>
              <Pen />
            </TableButton>
          </Link>
          <ConfirmDeletePlansDialog
            trigger={
              <TableButton variant={"table_icon_danger"}>
                <Trash2 />
              </TableButton>
            }
            code={row.getValue("code")}
          />
        </div>
      ),
    },
    {
      id: "show_more",
      header: t("more"),
      cell: ({ row }) => {
        return (
          <Link
            href={`/plans/${row.original.code.toLowerCase()}/activity`}
            className="flex items-center justify-center"
          >
            <TableButton variant={"table_icon_activity"}>
              <Activity />
            </TableButton>
          </Link>
        );
      },
    },
  ];
}
