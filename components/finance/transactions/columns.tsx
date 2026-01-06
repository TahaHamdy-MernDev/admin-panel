import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

export type TransactionRow = {
  transaction_id: number;
  transaction_ref: string;
  amount: number;
  note?: string;
  received_at: string;
  created_at: string;
  term: {
    term_id: number;
    name: string;
  };
  account: {
    account_id: number;
    name: string;
  };
};

export function useTransactionsColumns(): ColumnDef<TransactionRow>[] {
  const t = useTranslations("data-table.columns");

  return [
    { accessorKey: "transaction_id", header: "#" },
    { accessorKey: "created_at", header: t("created_at") },
    { accessorKey: "transaction_ref", header: t("finance.transaction_ref") },
    { accessorKey: "amount", header: t("finance.amount") },
    { accessorKey: "term.name", header: t("finance.term_name") },
    { accessorKey: "account.name", header: t("finance.account_name") },
    { accessorKey: "received_at", header: t("finance.received_at") },
    { accessorKey: "note", header: t("finance.note") },
  ];
}
