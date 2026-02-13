import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Table } from "@tanstack/react-table";

import { TableLimitSelect } from "./table-limit-selections";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
type Props<TData> = {
  table: Table<TData>;
  t: ReturnType<typeof useTranslations>;
  total_count: number;
  current_limit: number;
  right?: React.ReactNode;
  is_loading?: boolean;
};
function TableActions<TData>({
  table,
  right,
  total_count,
  current_limit,
  t,
  is_loading,
}: Props<TData>) {
  return (
    <div className="flex items-center justify-between py-4 gap-2">
      <div className="flex gap-2">
        <div className="w-[220px]">
          {is_loading ? (
            <Skeleton className="w-[220px] h-9" />
          ) : (
            <InputGroup className="shadow-none">
              <InputGroupInput
                placeholder={t("search")}
                value={(table.getState().globalFilter as string) ?? ""}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
                className="rounded-md pb-1.5 text-xs w-[220px] shadow-none"
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          )}
        </div>
        {total_count > 25 && (
          <TableLimitSelect
            total_count={total_count}
            currentLimit={current_limit}
          />
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

export default TableActions;
