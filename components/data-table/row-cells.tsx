import { Row, Table } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logs, MoreHorizontal, Pen, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
export function SelectAllCheckbox<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className="rtl:-mb-1 flex justify-center items-center p-1">
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        className="shadow-none"
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all rows"
      />
    </div>
  );
}

export function RowCheckbox<TData>({ row }: { row: Row<TData> }) {
  return (
    <div className="rtl:-mb-1 flex justify-center items-center p-1">
      <Checkbox
        checked={row.getIsSelected()}
        className="shadow-none"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    </div>
  );
}



export function RowDropDownMore<TData>({ row }: { row: Row<TData> }) {
  const t = useTranslations("data-table.columns");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"table_icon"}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={10}>
        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Logs className="text-primary" /> {t("logs")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Pen className="text-primary" /> {t("edit")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Trash className="text-destructive" /> {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
