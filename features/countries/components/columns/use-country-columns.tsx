import { useTranslations } from "next-intl";
import { CurrencyRow } from "../../types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useToggleCountryStatusMutation } from "../../api/use-toggle-country-status-mutation";
import { ConfirmableSwitch } from "@/components/dialogs/confirmable-switch";
import { DateCell } from "@/components/data-table/reusable/date-cell";
import { TableButton } from "@/components/ui/table-button";
import { Link } from "@/i18n/navigation";
import { MapPin } from "lucide-react";
function ToggleStatus({ status, id }: { status: boolean; id: string }) {
  const mutation = useToggleCountryStatusMutation();
  async function onConfirm() {
    await mutation.mutateAsync(id);
  }
  return (
    <ConfirmableSwitch
      value={status}
      defaultValue={status}
      onConfirm={onConfirm}
      feature_key="countries"
    />
  );
}
export function useCountryColumns(): ColumnDef<CurrencyRow>[] {
  const t = useTranslations("data-table.columns");
  return [
    {
      accessorKey: "id",
      header: "#",
      size: 50,
    },
    {
      accessorKey: "created_at",
      header: t("created_at"),
      cell: ({ row }) => {
        return <DateCell date={row.original.created_at} />;
      },
      size: 150,
    },
    {
      accessorKey: "country_ar",
      header: t("country"),
    },
    {
      accessorKey: "name_ar",
      header: t("name"),
    },
    {
      accessorKey: "image",
      header: t("image"),
      cell: ({ row }) => {
        const src = row.original.image;
        return (
          <div className="flex items-center justify-center gap-2">
            {src ? (
              <Image
                src={src}
                alt={row.original.slug}
                width={50}
                height={50}
                className="object-cover"
              />
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "slug",
      header: t("slug"),
    },
    {
      accessorKey: "is_active",
      header: t("active"),
      cell: ({ row }) => {
        return (
          <ToggleStatus status={row.original.is_active} id={row.original.id} />
        );
      },
    },
    {
      id: "show_governorates",
      header: t("governorates"),
      cell: ({ row }) => {
        const slug = row.original?.slug;
        if (!slug) {
          return null;
        }
        return (
          <Link
            href={`countries/${slug}/governorates`}
            className="flex items-center justify-center"
          >
            <TableButton variant={"table_icon_activity"}>
              <MapPin />
            </TableButton>
          </Link>
        );
      },
    },
  ];
}
