import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import {
  RowCheckbox,
  SelectAllCheckbox,
} from "@/components/data-table/row-cells";
import { ConfirmableSwitch } from "@/components/dialogs/confirmable-switch";
import { TableButton } from "@/components/ui/table-button";
import { Link } from "@/i18n/navigation";
import { Activity, Pen, Trash2 } from "lucide-react";

export type PlanRow = {
  plan_id: string;
  created_at: string;
  name: string;
  price: {
    amount: number;
    currency: string;
  }[];
  pilling: string;
  description: string;
  status: boolean;
};

export function usePlansColumns(): ColumnDef<PlanRow>[] {
  const t = useTranslations("data-table.columns");
  return [
    {
      id: "select",
      header: ({ table }) => <SelectAllCheckbox table={table} />,
      cell: ({ row }) => <RowCheckbox row={row} />,
      size: 50,
    },
    {
      accessorKey: "plan_id",
      header: "#",
    },
    {
      accessorKey: "created_at",
      header: t("created_at"),
    },
    {
      accessorKey: "name",
      header: t("plans.name"),
    },
    {
      accessorKey: "price",
      header: t("plans.price"),
      cell: ({ row }) => {
        const prices = row.getValue("price") as {
          amount: number;
          currency: string;
        }[];
        return prices.length > 0
          ? prices.map((p) => `${p.amount} ${p.currency}`).join("/")
          : "-";
      },
    },
    {
      accessorKey: "pilling",
      header: t("plans.pilling"),
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as boolean;
        return (
          <ConfirmableSwitch
            value={status}
            defaultValue={!!status}
            onConfirm={async (value) => {
              console.log(value);
              // await fetch("/api/feature", {
              //   method: "POST",
              //   body: JSON.stringify({ enabled: value }),
              // });
            }}
            feature_key="plans"
          />
        );
      },
    },
    {
      id: "actions",
      header: t("actions"),
      cell: ({ row }) => (
        <div className="flex flex-row gap-1 space-x-1">
          <TableButton variant={"table_icon_edit"}>
            <Pen />
          </TableButton>
          <TableButton variant={"table_icon_danger"}>
            <Trash2 />
          </TableButton>
        </div>
      ),
    },
    {
      id: "show_more",
      header: t("more"),
      cell: ({ row }) => {
        return (
          <TableButton variant={"table_icon_activity"}>
            <Link href={`/panel/plans/activity/${row.original.plan_id}`}>
              <Activity />
            </Link>
          </TableButton>
        );
      },
    },
  ];
}
