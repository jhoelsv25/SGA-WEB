"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DataTableProps } from "./types";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableCursorPagination } from "./data-table-cursor-pagination";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, FileValidationIcon, Loading03Icon } from "@hugeicons/core-free-icons";

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  isFetchingNextPage = false,
  emptyMessage = "No se encontraron resultados con los criterios seleccionados.",
  searchKey,
  searchPlaceholder = "Filtrar resultados...",
  toolbarActions,
  pagination = true,
  cursorPagination,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const memoizedData = React.useMemo(() => data, [data]);
  const memoizedColumns = React.useMemo(() => columns, [columns]);

  // Si se usa cursorPagination, se deshabilita la paginación interna por offset de react-table
  const isOffsetPaginationActive = Boolean(pagination && !cursorPagination);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isOffsetPaginationActive ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const paginationOptions = typeof pagination === "object" ? pagination : {};

  return (
    <div className={cn("w-full max-w-full min-w-0 space-y-4", className)}>
      {(searchKey || toolbarActions) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {searchKey ? (
            <div className="w-full sm:max-w-xs">
              <InputGroup className="border-border/80 bg-card focus-within:border-primary focus-within:ring-primary/20 h-10 rounded-2xl shadow-2xs transition-all focus-within:ring-2">
                <InputGroupAddon align="inline-start" className="text-muted-foreground pl-3">
                  <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={2} />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder={searchPlaceholder}
                  value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn(searchKey)?.setFilterValue(event.target.value)
                  }
                  className="placeholder:text-muted-foreground text-xs font-medium"
                />
              </InputGroup>
            </div>
          ) : (
            <div />
          )}

          {toolbarActions && <div className="flex items-center gap-2">{toolbarActions}</div>}
        </div>
      )}

      <div className="border-border/50 bg-card shadow-primary/5 ring-primary/5 w-full max-w-full min-w-0 overflow-hidden rounded-3xl shadow-lg ring-1 backdrop-blur-xs transition-all">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isActions = header.column.id === "actions";
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          isActions &&
                            "bg-card/95 sticky right-0 z-10 w-14 pr-5 text-right shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.08)] backdrop-blur-sm",
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`loading-row-${index}`}>
                    {columns.map((col, colIndex) => {
                      const isActions = (col as { id?: string }).id === "actions";
                      return (
                        <TableCell
                          key={`loading-cell-${colIndex}`}
                          className={cn(isActions && "bg-card sticky right-0 w-14 pr-5 text-right")}
                        >
                          <div className="flex items-center gap-2.5 py-1">
                            <Skeleton
                              className={cn("h-4 rounded-md", colIndex === 0 ? "w-44" : "w-24")}
                            />
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="group"
                    >
                      {row.getVisibleCells().map((cell) => {
                        const isActions = cell.column.id === "actions";
                        return (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              isActions &&
                                "bg-card sticky right-0 z-10 w-14 pr-5 text-right shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.08)]",
                            )}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                  {isFetchingNextPage && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="py-3 text-center">
                        <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
                          <HugeiconsIcon
                            icon={Loading03Icon}
                            size={14}
                            strokeWidth={2}
                            className="animate-spin"
                          />
                          <span>Cargando más registros...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-64 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="bg-muted/60 text-muted-foreground shadow-primary/5 ring-primary/5 flex size-12 items-center justify-center rounded-2xl shadow-sm ring-1">
                        <HugeiconsIcon icon={FileValidationIcon} size={22} strokeWidth={2} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-foreground text-sm font-bold">
                          No se encontraron registros
                        </p>
                        <p className="text-muted-foreground mx-auto max-w-sm text-xs">
                          {emptyMessage}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {cursorPagination ? (
          <div className="border-border/60 bg-muted/20 border-t px-4 py-1.5">
            <DataTableCursorPagination {...cursorPagination} />
          </div>
        ) : (
          isOffsetPaginationActive && (
            <div className="border-border/60 bg-muted/20 border-t px-4 py-1.5">
              <DataTablePagination
                table={table}
                pageSizeOptions={paginationOptions.pageSizeOptions}
                showTotal={paginationOptions.showTotal}
                page={paginationOptions.page}
                totalPages={paginationOptions.totalPages}
                total={paginationOptions.total}
                onNextPage={paginationOptions.onNextPage}
                onPreviousPage={paginationOptions.onPreviousPage}
                onFirstPage={paginationOptions.onFirstPage}
                onLastPage={paginationOptions.onLastPage}
                canNextPage={paginationOptions.canNextPage}
                canPreviousPage={paginationOptions.canPreviousPage}
                isLoadingNextPage={paginationOptions.isLoadingNextPage}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
