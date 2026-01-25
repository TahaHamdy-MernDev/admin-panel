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
import { useTogglePlanStatusMutation } from "../api/use-toggle-plan-status-mutation";
import { useTogglePlanVisibilityMutation } from "../api/use-toggle-plan-visibility-mutation";
import { PlanRow } from "../types";
function ToggleStatus({ status, code }: { status: boolean; code: string }) {
  const mutation = useTogglePlanStatusMutation();
  async function onConfirm() {
    await mutation.mutateAsync(code);
  }
  return (
    <ConfirmableSwitch
      value={status}
      defaultValue={status}
      onConfirm={onConfirm}
      feature_key="plans"
    />
  );
}
function ToggleVisibility({ status, code }: { status: boolean; code: string }) {
  const mutation = useTogglePlanVisibilityMutation();
  async function onConfirm() {
    await mutation.mutateAsync(code);
  }
  return (
    <ConfirmableSwitch
      value={status}
      defaultValue={status}
      onConfirm={onConfirm}
      feature_key="plans-visibility"
    />
  );
}
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
      accessorKey: "code",
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
      accessorKey: "prices",
      header: t("plans.price"),
      cell: ({ row }) => {
        const prices = row.getValue("prices") as {
          price_egp: number;
          price_usd: number;
        }[];
        return prices.length > 0
          ? `${prices[0].price_egp} EGP / ${prices[0].price_usd} USD`
          : "-";
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
        return <ToggleStatus status={status} code={row.getValue("code")} />;
      },
    },
    {
      accessorKey: "is_visible",
      header: t("visible"),
      cell: ({ row }) => {
        const status = row.getValue("is_visible") as boolean;
        return <ToggleVisibility status={status} code={row.getValue("code")} />;
      },
    },
    {
      id: "actions",
      header: t("actions"),
      cell: () => (
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
            <Link href={`/panel/plans/activity/${row.original.code}`}>
              <Activity />
            </Link>
          </TableButton>
        );
      },
    },
  ];
}
