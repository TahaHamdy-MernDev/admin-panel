import ChangePasswordDialog from "@/components/customers/change-password-dialog";
import ConfirmDeleteCustomerDialog from "@/components/customers/confirm-delete-customer-dialog";
import {
  RowCheckbox,
  SelectAllCheckbox,
} from "@/components/data-table/row-cells";
import { ConfirmableSwitch } from "@/components/dialogs/confirmable-switch";
import Text from "@/components/typography";
import { TableButton } from "@/components/ui/table-button";
import { Link } from "@/i18n/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Activity, KeyRound, Trash2, User } from "lucide-react";
import { useTranslations } from "next-intl";

type CustomerRow = {
  customer_id: string;
  name: string;
  phone: string;
  created_at: string;
  status: boolean;
  login_history: {
    ip: string;
    device: string;
    created_at: string;
  }[];
  plan: {
    plan_id: number;
    name: string;
  };
};

export function useCustomersColumns(): ColumnDef<CustomerRow>[] {
  const t = useTranslations("data-table.columns");
  return [
    {
      id: "select",
      header: ({ table }) => <SelectAllCheckbox table={table} />,
      cell: ({ row }) => <RowCheckbox row={row} />,
      size: 50,
    },
    {
      accessorKey: "customer_id",
      header: t("id"),
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: t("created_at"),
    },
    {
      id: "customer_info",
      accessorFn: (row) => `${row.name} - ${row.phone}`,
      header: t("customers.customer_info"),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-0">
            {row.original.name} <br />
            {row.original.phone}
          </div>
        );
      },
    },

    {
      id: "last_login",
      accessorKey: "login_history",
      accessorFn: (row) => row.login_history[0].created_at,
      header: t("customers.last_login"),
    },
    {
      id: "login_device",
      accessorKey: "login_history",
      accessorFn: (row) => row.login_history[0],
      header: () => (
        <div className="flex flex-col gap-0">
          {t("customers.ip")} <br />
          {t("customers.device")}
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-1">
            {row.original.login_history[0].ip} <br />
            {row.original.login_history[0].device}
          </div>
        );
      },
    },
    {
      id: "plan",
      accessorFn: (row) => row.plan.name,
      header: t("plans.name"),
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
            feature_key="customer_status"
          />
        );
      },
    },
    {
      id: "actions",
      header: t("actions"),
      cell: ({ row }) => {
        return (
          <div className="flex flex-row gap-1 space-x-1">
            <ChangePasswordDialog
              trigger={
                <TableButton variant={"table_icon_edit"}>
                  <KeyRound />
                </TableButton>
              }
              customer_id={row.original.customer_id}
            />
            <TableButton variant={"table_icon_login_as"}>
              {/* <Link
                href={`/panel/customers/activity/${row.original.customer_id}`}
              > */}
              <User />
              {/* </Link> */}
            </TableButton>
            <ConfirmDeleteCustomerDialog
              trigger={
                <TableButton variant={"table_icon_danger"}>
                  <Trash2 />
                </TableButton>
              }
              customerName={row.original.name}
            />
          </div>
        );
      },
    },
    {
      id: "show_more",
      header: t("more"),
      cell: ({ row }) => {
        return (
          <TableButton variant={"table_icon_activity"}>
            <Link
              href={`/panel/customers/activity/${row.original.customer_id}`}
            >
              <Activity />
            </Link>
          </TableButton>
        );
      },
    },
  ];
}
