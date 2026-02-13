import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  Table as TanStackTable,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";

type Props<TData, TValue> = {
  table: TanStackTable<TData>;
  columns: ColumnDef<TData, TValue>[];
  t: ReturnType<typeof useTranslations>;
  is_loading?: boolean;
  skeletonRows?: number;
};

function MainTable<TData, TValue>({
  table,
  columns,
  t,
  is_loading,
  skeletonRows = 5,
}: Props<TData, TValue>) {
  return (
    <Table>
      {/* ---------- HEADER ---------- */}
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                style={{ width: header.getSize() }}
                className="text-center text-balance text-sm"
              >
                {is_loading ? (
                  <Skeleton className="h-4 w-[70%]" />
                ) : header.isPlaceholder ? null : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      {/* ---------- BODY ---------- */}
      <TableBody>
        {is_loading ? (
          Array.from({ length: skeletonRows }).map((_, rowIndex) => (
            <TableRow key={`skeleton-row-${rowIndex}`}>
              {columns.map((_, colIndex) => (
                <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() ? "selected" : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              {t("no_results")}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default MainTable;
