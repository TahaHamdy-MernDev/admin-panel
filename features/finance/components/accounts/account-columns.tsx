import { ConfirmableSwitch } from "@/components/dialogs/confirmable-switch";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { AccountRow } from "../../types";
import { useSetDefaultAccountMutation } from "../../api/accounts/use-set-default-account-mutation";
import { useToggleAccountStatusMutation } from "../../api/accounts/use-toggle-account-status-mutation";
function ToggleDefaultAccountStatus({
  is_active,
  id,
}: {
  is_active: boolean;
  id: number;
}) {
  const mutation = useSetDefaultAccountMutation();
  async function onSubmit() {
    await mutation.mutateAsync({ id });
  }
  return (
    <ConfirmableSwitch
      onConfirm={onSubmit}
      defaultValue={is_active}
      feature_key="finance.accounts"
    />
  );
}
function ToggleAccountStatus({
  is_active,
  id,
}: {
  is_active: boolean;
  id: number;
}) {
  const mutation = useToggleAccountStatusMutation();
  async function onSubmit() {
    await mutation.mutateAsync({ id });
  }
  return (
    <ConfirmableSwitch
      onConfirm={onSubmit}
      defaultValue={is_active}
      feature_key="finance.accounts"
    />
  );
}
export function useAccountsColumns(): ColumnDef<AccountRow>[] {
  const t = useTranslations("data-table.columns");
  return [
    // {
    //   id: "select",
    //   header: ({ table }) => <SelectAllCheckbox table={table} />,
    //   cell: ({ row }) => <RowCheckbox row={row} />,
    //   size: 50,
    // },
    {
      accessorKey: "id",
      header: "#",
    },
    {
      accessorKey: "created_at",
      header: t("created_at"),
      cell: ({ row }) => {
        return (
          <span className="flex flex-col">
            <p>{format(row.original.created_at, "hh:mm a")}</p>
            <p>{format(row.original.created_at, "yyyy-MM-dd")}</p>
          </span>
        );
      },
    },
    {
      accessorKey: "name",
      header: t("finance.account_name"),
    },
    {
      accessorKey: "balance",
      header: t("finance.balance"),
    },
    {
      accessorKey: "is_default",
      header: t("finance.is_default"),
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <ToggleDefaultAccountStatus
          is_active={row.original.is_default}
          id={row.original.id}
        />
      ),
    },
    {
      accessorKey: "is_active",
      enableGlobalFilter: false,
      header: t("status"),
      cell: ({ row }) => (
        <ToggleAccountStatus
          is_active={row.original.is_active}
          id={row.original.id}
        />
      ),
    },
  ];
}
