import { ColumnDef } from "@tanstack/react-table";
import { GovernorateRow } from "../../types";
import { useTranslations } from "next-intl";
import { TableButton } from "@/components/ui/table-button";
import { Link } from "@/i18n/navigation";
import { MapPinHouse } from "lucide-react";

export function useGovernorateColumns(): ColumnDef<GovernorateRow>[] {
  const t = useTranslations("data-table.columns");
  return [
    {
      accessorKey: "id",
      header: "#",
      size: 50,
    },
    {
      accessorKey: "name_ar",
      header: t("name_ar"),
    },
    {
      accessorKey: "name_en",
      header: t("name_en"),
    },
    {
      id: "show_governorates_districts",
      header: t("districts"),
      cell: ({ row }) => {
        const id = row.original?.id;
        if (!id) {
          return null;
        }
        return (
          <Link href={`governorates/${id}/districts`} className="flex items-center justify-center">
            <TableButton variant={"table_icon_activity"}>
              <MapPinHouse />
            </TableButton>
          </Link>
        );
      },
    },
  ];
}
