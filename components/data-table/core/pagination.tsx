"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { usePathname, useRouter } from "@/i18n/navigation";
import { PaginationMeta } from "@/types/api-types";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface DataTablePaginationProps {
  meta: PaginationMeta | undefined;
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

export function PaginationBar({
  meta,
  loading = false,
}: DataTablePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = meta?.current_page ?? 1;
  const totalPages = meta?.total_pages ?? 1;

  const setPageInUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || loading)
      return;
    setPageInUrl(page);
  };

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxVisible = 5;

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Pagination className="justify-end">
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            className={cn(
              "p-2! size-8! rtl:mb-1 rtl:rotate-180 cursor-pointer",
              "transition-colors",
              currentPage === 1 && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>

        {/* Pages */}
        {getPageNumbers().map((p, i) =>
          p === "..." ? (
            <PaginationEllipsis key={i} />
          ) : (
            <PaginationItem key={`${p}-${i}`} className="rtl:mb-1">
              <PaginationLink
                href="#"
                className="rounded-md cursor-pointer transition-colors p-2! size-8!"
                isActive={p === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            className={cn(
              "p-2! size-8! rtl:mb-1 rtl:rotate-180 cursor-pointer",
              "transition-colors",
              currentPage === totalPages && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
