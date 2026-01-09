import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Table } from "@tanstack/react-table";

import { TableLimitSelect } from "./table-limit-selections";
import { Skeleton } from "@/components/ui/skeleton";
type Props<TData> = {
  table: Table<TData>;
  right?: React.ReactNode;
  total_count: number;
  current_limit: number;
  is_loading?: boolean;
};
function TableActions<TData>({
  table,
  right,
  total_count,
  current_limit,
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
                placeholder={"search"}
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
