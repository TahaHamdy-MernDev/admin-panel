import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { TermRow } from "../../types";

export function useTermsColumns(): ColumnDef<TermRow>[] {
  const t = useTranslations("data-table.columns");

  return [
    { accessorKey: "id", header: "#" },
    { accessorKey: "name", header: t("finance.term_name") },
    { accessorKey: "type", header: t("finance.term_type") },
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
  ];
}
