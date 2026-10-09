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

export interface DataTableEmptyState {
  title?: string;
  description?: string;
  action?: ReactNode;
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

  /** Indica si ocurrió un error al cargar la información. Muestra ErrorState con opción de reintento. */
  isError?: boolean;
  /** Función para reintentar la carga en caso de error. */
  onRetry?: () => void;
  /** Indica si hay filtros aplicados para ajustar el mensaje de estado vacío. */
  hasActiveFilters?: boolean;
  /** Configuración personalizada para el estado vacío cuando no hay registros. */
  emptyState?: DataTableEmptyState;
  /** Renderizado alternativo en vista de tarjetas para dispositivos móviles (pantallas menores a md). */
  mobileCard?: (row: TData) => ReactNode;
  /** Título accesible oculto para lectores de pantalla (caption de la tabla). */
  caption?: string;
}
