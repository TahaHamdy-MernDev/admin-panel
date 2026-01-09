
import { AccountRow } from "@/hooks/api/finance/use-accounts";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

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
      accessorKey: "account_id",
      header: "#",
    },
    {
      accessorKey: "created_at",
      header: t("created_at"),
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
      accessorKey: "status",
      header: t("finance.status"),
    },
  ];
}
