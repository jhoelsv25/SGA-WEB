import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";

export interface DataTablePaginationProps {
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

export interface CursorPaginationProps {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  isLoading?: boolean;
  totalCount?: number;
  loadedCount?: number;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  emptyMessage?: string;
  searchKey?: string;
  searchPlaceholder?: string;
  toolbarActions?: ReactNode;
  pagination?: DataTablePaginationProps | boolean;
  cursorPagination?: CursorPaginationProps;
  className?: string;
}
