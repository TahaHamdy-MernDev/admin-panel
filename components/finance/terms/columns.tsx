import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

export type TermRow = {
  term_id: number;
  name: string;
  created_at: string;
};

export function useTermsColumns(): ColumnDef<TermRow>[] {
  const t = useTranslations("data-table.columns");

  return [
    { accessorKey: "term_id", header: "#" },
    { accessorKey: "name", header: t("finance.term_name") },
    { accessorKey: "created_at", header: t("created_at") },
  ];
}
