"use client";
import { Badge } from "@/components/badge";
import {
  RowCheckbox,
  SelectAllCheckbox,
} from "@/components/data-table/row-cells";
import { ConfirmableSwitch } from "@/components/dialogs/confirmable-switch";
import {
  StaffRow,
  useToggleStaffStatusMutation,
} from "@/hooks/api/staff/use-staff";
import { formatPhone } from "@/lib/international-phone";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

function ToggleStaffStatus({
  staffId,
  is_active,
}: {
  staffId: string;
  is_active: boolean;
}) {
  const toggle = useToggleStaffStatusMutation();
  async function onSubmit() {
    await toggle.mutateAsync(Number(staffId));
  }
  return (
    <ConfirmableSwitch
      value={is_active}
      onConfirm={onSubmit}
      feature_key="staff"
    />
  );
}

export function useStaffColumns(): ColumnDef<StaffRow>[] {
  const t = useTranslations("data-table.columns");
  return [
    {
      id: "select",
      header: ({ table }) => <SelectAllCheckbox table={table} />,
      cell: ({ row }) => <RowCheckbox row={row} />,
      size: 50,
    },
    {
      id: "id",
      accessorKey: "id",
      header: "#",
    },
    {
      accessorKey: "createdAt",
      header: t("created_at"),
      cell: ({ row }) => {
        return (
          <span className="flex flex-col">
            <p>{format(row.original.createdAt, "hh:mm a")}</p>
            <p>{format(row.original.createdAt, "yyyy-MM-dd")}</p>
          </span>
        );
      },
    },

    {
      id: "name",
      accessorFn: (row) =>
        `${row.firstName} ${row.lastName} - ${row.phoneNumber}`,
      header: t("staff.info"),
      cell: ({ row }) => {
        return (
          <span className="flex flex-col">
            <p>
              {row.original.firstName} {row.original.lastName}
            </p>
            <p>
              {formatPhone(row.original.phoneNumber, {
                countryCode: row.original.country,
              })}
            </p>
          </span>
        );
      },
    },
    {
      id: "code",
      accessorKey: "code",
      header: t("code"),
    },
    {
      id: "email",
      accessorKey: "email",
      header: t("staff.email"),
    },
    {
      id: "role",
      accessorKey: "platform_role",
      header: t("staff.role"),
      cell: ({ row }) => {
        return <Badge role={row.original.platform_role} />;
      },
    },
    {
      id: "status",
      accessorKey: "is_active",
      header: t("status"),
      cell: ({ row }) => (
        <ToggleStaffStatus
          staffId={row.original.id}
          is_active={row.original.is_active}
        />
      ),
    },
  ];
}
