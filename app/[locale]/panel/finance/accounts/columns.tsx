import {
  RowCheckbox,
  SelectAllCheckbox,
} from "@/components/data-table/row-cells";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

export type AccountRow = {
  account_id: number;
  name: string;
  balance: number;
  created_at: string;
  status: boolean;
};
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
