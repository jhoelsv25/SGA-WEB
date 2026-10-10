"use client";

import * as React from "react";

export interface CursorPaginationData {
  hasMore?: boolean;
  nextCursor?: string | null;
}

export interface UseCursorPaginationOptions {
  /**
   * Arreglo de dependencias que, al cambiar (ej. filtros de búsqueda o categoría),
   * reinician automáticamente la navegación al primer cursor (página 0).
   */
  resetDeps?: readonly unknown[];
}

export interface UseCursorPaginationReturn {
  /** Cursor actual para enviar en la consulta (null en la página inicial) */
  cursor: string | null;
  /** Índice de la página actual (base 0) */
  pageIndex: number;
  /** Número de página para mostrar al usuario (base 1) */
  page: number;
  /** Indica si se puede retroceder a una página anterior */
  hasPreviousPage: boolean;
  /** Función para avanzar a la página siguiente pasando el cursor obtenido */
  onNextPage: (nextCursor?: string | null) => void;
  /** Función para retroceder a la página anterior */
  onPreviousPage: () => void;
  /** Reinicia el historial de cursores a la página inicial */
  reset: () => void;
  /**
   * Retorna las propiedades preparadas para pasar directamente a `DataTableCursorPagination`
   * o al prop `cursorPagination` de `DataTable`.
   */
  getPaginationProps: (data?: CursorPaginationData | null) => {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    onNextPage: () => void;
    onPreviousPage: () => void;
  };
}

/**
 * Hook global estandarizado para gestionar la paginación por cursores con TanStack Query y DataTableCursorPagination.
 *
 * Mantiene un historial de cursores en memoria para permitir navegación bidireccional (atrás / adelante)
 * y reinicia el estado de forma reactiva cuando cambian los filtros asociados.
 *
 * @example
 * ```tsx
 * const pagination = useCursorPagination({ resetDeps: [search, estado, tipo] });
 * const { data, isLoading, isFetching } = useQuery({ cursor: pagination.cursor, ... });
 *
 * // En el render:
 * <DataTableCursorPagination
 *   {...pagination.getPaginationProps(data)}
 *   isLoading={isFetching}
 *   loadedCount={items.length}
 * />
 * ```
 */
export function useCursorPagination(
  options: UseCursorPaginationOptions = {},
): UseCursorPaginationReturn {
  const { resetDeps = [] } = options;
  const [cursorHistory, setCursorHistory] = React.useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = React.useState<number>(0);

  // Registro del estado previo de las dependencias para detectar cambios según el patrón oficial de React
  const [prevDeps, setPrevDeps] = React.useState<readonly unknown[]>(resetDeps);

  const depsChanged =
    resetDeps.length !== prevDeps.length ||
    resetDeps.some((dep, index) => !Object.is(dep, prevDeps[index]));

  if (depsChanged) {
    setPrevDeps(resetDeps);
    setCursorHistory([null]);
    setPageIndex(0);
  }

  const cursor = cursorHistory[pageIndex] ?? null;
  const hasPreviousPage = pageIndex > 0;

  const onNextPage = React.useCallback(
    (nextCursor?: string | null) => {
      if (nextCursor) {
        setCursorHistory((prev) => [...prev.slice(0, pageIndex + 1), nextCursor]);
        setPageIndex((prev) => prev + 1);
      }
    },
    [pageIndex],
  );

  const onPreviousPage = React.useCallback(() => {
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
    }
  }, [pageIndex]);

  const reset = React.useCallback(() => {
    setCursorHistory([null]);
    setPageIndex(0);
  }, []);

  const getPaginationProps = React.useCallback(
    (data?: CursorPaginationData | null) => ({
      hasNextPage: Boolean(data?.hasMore && data?.nextCursor),
      hasPreviousPage,
      onNextPage: () => onNextPage(data?.nextCursor),
      onPreviousPage,
    }),
    [hasPreviousPage, onNextPage, onPreviousPage],
  );

  return {
    cursor,
    pageIndex,
    page: pageIndex + 1,
    hasPreviousPage,
    onNextPage,
    onPreviousPage,
    reset,
    getPaginationProps,
  };
}
