import { ColumnDef } from "@tanstack/react-table";
import { DistrictRow } from "../../types";
import { useTranslations } from "next-intl";
export function useDistrictColumns(): ColumnDef<DistrictRow>[] {
  const t = useTranslations("data-table.columns");
  return [
    // {
    //   accessorKey: "id",
    //   header: "#",
    //   size: 50,
    // },
    {
      accessorKey: "name_ar",
      header: t("name_ar"),
    },
    {
      accessorKey: "name_en",
      header: t("name_en"),
    },
  ];
}
