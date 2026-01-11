import { TransactionRow } from "@/hooks/api/finance/use-transaction";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

export function useTransactionsColumns(): ColumnDef<TransactionRow>[] {
  const t = useTranslations("data-table.columns");

  return [
    { accessorKey: "id", header: "#" },
    {
      accessorKey: "created_at",
      header: t("created_at"),
      cell: ({ row }) => (
        <span className="flex flex-col">
          <p>{format(row.original.created_at, "hh:mm a")}</p>
          <p>{format(row.original.created_at, "yyyy-MM-dd")}</p>
        </span>
      ),
    },
    { accessorKey: "code", header: t("finance.transaction_ref") },
    { accessorKey: "amount", header: t("finance.amount") },
    { accessorKey: "term.name", header: t("finance.term_name") },
    { accessorKey: "account.name", header: t("finance.account_name") },
    {
      accessorKey: "date",
      header: t("finance.received_at"),
      cell: ({ row }) => format(row.original.date, "yyyy-MM-dd"),
    },
    { accessorKey: "note", header: t("finance.note") },
  ];
}
