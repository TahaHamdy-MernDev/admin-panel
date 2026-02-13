import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { IntegrationProvider, IntegrationRow } from "../types";
import { ConfirmableSwitch } from "@/components/dialogs/confirmable-switch";
import { useToggleIntegrationVisibilityMutation } from "../api/use-toggle-integration-visibility-mutation";
import { useToggleIntegrationStatusMutation } from "../api/use-toggle-integration-status-mutation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DateCell } from "@/components/data-table/reusable/date-cell";
function ToggleStatus({ status, id }: { status: boolean; id: number }) {
  const mutation = useToggleIntegrationStatusMutation();
  async function onConfirm() {
    await mutation.mutateAsync(id.toString());
  }
  return (
    <ConfirmableSwitch
      value={status}
      defaultValue={status}
      onConfirm={onConfirm}
      feature_key="integrations.activity"
    />
  );
}
function ToggleVisibility({ status, id }: { status: boolean; id: number }) {
  const mutation = useToggleIntegrationVisibilityMutation();
  async function onConfirm() {
    await mutation.mutateAsync(id.toString());
  }
  return (
    <ConfirmableSwitch
      value={status}
      defaultValue={status}
      onConfirm={onConfirm}
      feature_key="integrations.visibility"
    />
  );
}
export function useIntegrationsColumns(): ColumnDef<IntegrationRow>[] {
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
      cell: ({ row }) => <DateCell date={row.original.created_at} />,
    },
    {
      accessorKey: "image",
      header: t("image"),
      cell: ({ row }) => {
        const image = row.getValue("image") as string;
        return (
          <div className="flex items-center justify-center">
            <Avatar size="lg">
              <AvatarImage
                src={image}
                width={50}
                height={50}
                alt={row.getValue("provider") as string}
                className="object-contain"
              />
              <AvatarFallback>
                {row.getValue("provider") as string}
              </AvatarFallback>
            </Avatar>
          </div>
        );
      },
    },
    {
      accessorKey: "provider",
      header: t("name"),
      cell: ({ row }) => {
        const provider = row.getValue("provider") as IntegrationProvider;
        return t(`integrations.${provider}`);
      },
    },
    {
      accessorKey: "is_active",
      header: t("status"),
      cell: ({ row }) => {
        const status = row.original.is_active as boolean;
        const id = row.original.id;
        return <ToggleStatus status={status} id={id} />;
      },
    },
    {
      id: "is_visible",
      header: t("visible"),
      cell: ({ row }) => {
        const status = row.original.is_visible as boolean;
        console.log("status", status);
        const id = row.original.id;
        return <ToggleVisibility status={status} id={id} />;
      },
    },
  ];
}
