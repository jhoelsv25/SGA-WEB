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
    <div className="flex flex-col items-center justify-between gap-3 px-1 py-0.5 sm:flex-row">
      <div className="text-muted-foreground text-xs font-medium">
        {selectedCount > 0 ? (
          <span>
            <strong className="text-foreground font-semibold">{selectedCount}</strong> de{" "}
            <strong className="text-foreground font-semibold">{total}</strong> fila(s)
            seleccionada(s)
          </span>
        ) : showTotal && typeof total === "number" ? (
          <span>
            Total: <strong className="text-foreground font-semibold">{total}</strong>{" "}
            {total === 1 ? "registro" : "registros"}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-muted-foreground text-xs font-medium">
          Página <strong className="text-foreground font-semibold">{currentPage}</strong> de{" "}
          <strong className="text-foreground font-semibold">{totalPages || 1}</strong>
        </span>

        <div className="flex items-center gap-1">
          {isLoadingNextPage && (
            <HugeiconsIcon
              icon={Loading03Icon}
              size={14}
              strokeWidth={2}
              className="text-muted-foreground mr-1.5 animate-spin"
            />
          )}

          <Button
            variant="outline"
            size="icon-xs"
            onClick={handleFirstPage}
            disabled={!canPrevious || isLoadingNextPage}
            aria-label="Ir a la primera página"
            className="border-border/70 bg-background hover:bg-muted text-muted-foreground hover:text-foreground size-7.5 rounded-full border transition-all disabled:opacity-30"
          >
            <HugeiconsIcon icon={ArrowLeftDoubleIcon} size={14} strokeWidth={2} />
          </Button>

          <Button
            variant="outline"
            size="icon-xs"
            onClick={handlePreviousPage}
            disabled={!canPrevious || isLoadingNextPage}
            aria-label="Página anterior"
            className="border-border/70 bg-background hover:bg-muted text-muted-foreground hover:text-foreground size-7.5 rounded-full border transition-all disabled:opacity-30"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
          </Button>

          <Button
            variant="outline"
            size="icon-xs"
            onClick={handleNextPage}
            disabled={!canNext || isLoadingNextPage}
            aria-label="Página siguiente"
            className="border-border/70 bg-background hover:bg-muted text-muted-foreground hover:text-foreground size-7.5 rounded-full border transition-all disabled:opacity-30"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
          </Button>

          <Button
            variant="outline"
            size="icon-xs"
            onClick={handleLastPage}
            disabled={!canNext || isLoadingNextPage}
            aria-label="Ir a la última página"
            className="border-border/70 bg-background hover:bg-muted text-muted-foreground hover:text-foreground size-7.5 rounded-full border transition-all disabled:opacity-30"
          >
            <HugeiconsIcon icon={ArrowRightDoubleIcon} size={14} strokeWidth={2} />
          </Button>
        </div>
      </div>
    </div>
  );
}
