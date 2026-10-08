"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowLeftDoubleIcon,
  ArrowRightDoubleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";

interface DataTablePaginationControlProps<TData> {
  table?: Table<TData>;
  pageSizeOptions?: number[];
  showTotal?: boolean;
  page?: number;
  totalPages?: number;
  total?: number;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onFirstPage?: () => void;
  onLastPage?: () => void;
  canNextPage?: boolean;
  canPreviousPage?: boolean;
  isLoadingNextPage?: boolean;
}

export function DataTablePagination<TData>({
  table,
  showTotal = true,
  page: externalPage,
  totalPages: externalTotalPages,
  total: externalTotal,
  onNextPage,
  onPreviousPage,
  onFirstPage,
  onLastPage,
  canNextPage: externalCanNextPage,
  canPreviousPage: externalCanPreviousPage,
  isLoadingNextPage = false,
}: DataTablePaginationControlProps<TData>) {
  const isExternalPagination =
    typeof externalPage === "number" && typeof externalTotalPages === "number";

  const currentPage = isExternalPagination
    ? externalPage
    : (table?.getState().pagination.pageIndex ?? 0) + 1;
  const totalPages = isExternalPagination ? externalTotalPages : (table?.getPageCount() ?? 1);
  const total = isExternalPagination ? externalTotal : table?.getFilteredRowModel().rows.length;
  const selectedCount = table?.getFilteredSelectedRowModel().rows.length ?? 0;

  const canPrevious = isExternalPagination
    ? (externalCanPreviousPage ?? currentPage > 1)
    : (table?.getCanPreviousPage() ?? false);
  const canNext = isExternalPagination
    ? (externalCanNextPage ?? currentPage < totalPages)
    : (table?.getCanNextPage() ?? false);

  const handlePreviousPage = () => {
    if (isExternalPagination && onPreviousPage) {
      onPreviousPage();
    } else if (table) {
      table.previousPage();
    }
  };

  const handleNextPage = () => {
    if (isExternalPagination && onNextPage) {
      onNextPage();
    } else if (table) {
      table.nextPage();
    }
  };

  const handleFirstPage = () => {
    if (isExternalPagination && onFirstPage) {
      onFirstPage();
    } else if (table) {
      table.setPageIndex(0);
    }
  };

  const handleLastPage = () => {
    if (isExternalPagination && onLastPage) {
      onLastPage();
    } else if (table) {
      table.setPageIndex(table.getPageCount() - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 px-3 py-3 sm:flex-row">
      <div className="text-muted-foreground flex items-center gap-2 text-xs">
        <span className="border-border/70 bg-background text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-2xs">
          <span className="bg-primary size-1.5 rounded-full" />
          <span>
            {selectedCount > 0 ? (
              <>
                <strong className="text-foreground font-bold">{selectedCount}</strong> de{" "}
                <strong className="text-foreground font-bold">{total}</strong> fila(s)
                seleccionada(s)
              </>
            ) : showTotal && typeof total === "number" ? (
              <>
                Total: <strong className="text-foreground font-bold">{total}</strong> registro(s)
              </>
            ) : null}
          </span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="border-border/70 bg-background text-muted-foreground inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium shadow-2xs">
          <span>Página</span>
          <strong className="text-foreground font-bold">{currentPage}</strong>
          <span>de</span>
          <strong className="text-foreground font-bold">{totalPages || 1}</strong>
        </div>

        <div className="flex items-center gap-1">
          {isLoadingNextPage && (
            <HugeiconsIcon
              icon={Loading03Icon}
              size={14}
              strokeWidth={2}
              className="text-muted-foreground mr-2 animate-spin"
            />
          )}

          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleFirstPage}
            disabled={!canPrevious || isLoadingNextPage}
            aria-label="Ir a la primera página"
            className="border-border/70 bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 h-8 w-8 rounded-full transition-all disabled:opacity-30"
          >
            <HugeiconsIcon icon={ArrowLeftDoubleIcon} size={15} strokeWidth={2} />
          </Button>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={handlePreviousPage}
            disabled={!canPrevious || isLoadingNextPage}
            aria-label="Página anterior"
            className="border-border/70 bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 h-8 w-8 rounded-full transition-all disabled:opacity-30"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={15} strokeWidth={2} />
          </Button>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleNextPage}
            disabled={!canNext || isLoadingNextPage}
            aria-label="Página siguiente"
            className="border-border/70 bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 h-8 w-8 rounded-full transition-all disabled:opacity-30"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={2} />
          </Button>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleLastPage}
            disabled={!canNext || isLoadingNextPage}
            aria-label="Ir a la última página"
            className="border-border/70 bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 h-8 w-8 rounded-full transition-all disabled:opacity-30"
          >
            <HugeiconsIcon icon={ArrowRightDoubleIcon} size={15} strokeWidth={2} />
          </Button>
        </div>
      </div>
    </div>
  );
}
