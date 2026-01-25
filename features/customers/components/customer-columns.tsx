import ChangePasswordDialog from "@/features/customers/components/change-password-dialog";
import ConfirmDeleteCustomerDialog from "@/features/customers/components/confirm-delete-customer-dialog";
import {
  RowCheckbox,
  SelectAllCheckbox,
} from "@/components/data-table/row-cells";
import { ConfirmableSwitch } from "@/components/dialogs/confirmable-switch";
import { TableButton } from "@/components/ui/table-button";

import { Link } from "@/i18n/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { Activity, KeyRound, Trash2, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useToggleCustomerStatusMutation } from "../api/use-toggle-customer-status-mutation";
import { CustomerRow } from "../types";
function ToggleStatus({ status, id }: { status: boolean; id: string }) {
  const mutation = useToggleCustomerStatusMutation();
  async function handleToggle() {
    await mutation.mutateAsync(id);
  }
  return (
    <ConfirmableSwitch
      value={status}
      defaultValue={status}
      onConfirm={handleToggle}
      feature_key="customer_status"
    />
  );
}
function DeleteCustomer({ owner }: { owner: CustomerRow["owner"] }) {
  return (
    <ConfirmDeleteCustomerDialog
      trigger={
        <TableButton variant={"table_icon_danger"}>
          <Trash2 />
        </TableButton>
      }
      ownerId={owner.id.toString()}
      customerName={owner.firstName + " " + owner.lastName}
    />
  );
}
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
      accessorKey: "owner.code",
      header: t("id"),
    },
    {
      id: "created_at",
      accessorKey: "createdAt",
      header: t("created_at"),
      cell: ({ row }) => {
        return formatDate(row.original.owner.createdAt, "yyyy-MM-dd");
      },
    },
    {
      id: "customer_info",
      accessorFn: (row) =>
        `${row.owner.firstName} ${row.owner.lastName} - ${row.owner.phoneNumber}`,
      header: t("customers.customer_info"),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-0">
            {row.original.owner.firstName} {row.original.owner.lastName} <br />
            {row.original.owner.phoneNumber}
          </div>
        );
      },
    },

    {
      id: "last_login",
      accessorKey: "owner.sessions[0].created_at",
      header: t("customers.last_login"),
      cell: ({ row }) => {
        const lastLogin = row.original.owner?.sessions[0]?.created_at ?? null;
        return lastLogin ? formatDate(lastLogin, "yyyy-MM-dd HH:mm a") : "-";
      },
    },
    {
      id: "login_device",
      accessorKey: "owner.sessions",
      accessorFn: (row) => row.owner?.sessions[0],
      header: () => (
        <div className="flex flex-col gap-0">
          {t("customers.ip")} <br />
          {t("customers.device")}
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-1">
            {row.original.owner?.sessions[0]?.ip_address} <br />
            {row.original.owner?.sessions[0]?.browser}
          </div>
        );
      },
    },
    {
      id: "plan",
      accessorFn: (row) => row.tenantSubscriptions[0]?.plan.name,
      header: t("plans.name"),
    },
    {
      accessorKey: "owner",
      header: t("status"),
      cell: ({ row }) => {
        const status = row.original.owner.is_active;
        console.log("status ", status);

        return (
          <ToggleStatus status={status} id={row.original.owner.id.toString()} />
        );
      },
    },
    {
      id: "actions",
      header: t("actions"),
      cell: ({ row }) => {
        const owner = row.original.owner;
        return (
          <div className="flex flex-row gap-1 space-x-1">
            <ChangePasswordDialog
              trigger={
                <TableButton variant={"table_icon_edit"}>
                  <KeyRound />
                </TableButton>
              }
              customer_id={owner?.id?.toString() || ""}
            />
            <TableButton variant={"table_icon_login_as"}>
              {/* <Link
                href={`/panel/customers/activity/${row.original.customer_id}`}
              > */}
              <User />
              {/* </Link> */}
            </TableButton>
            <DeleteCustomer owner={owner} />
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
            <Link href={`/panel/customers/activity/${row.original.owner.code}`}>
              <Activity />
            </Link>
          </TableButton>
        );
      },
    },
  ];
}
