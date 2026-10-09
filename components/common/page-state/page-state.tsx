import * as React from "react";
import { TableSkeleton } from "@/components/common/skeletons";
import { EmptyState } from "@/components/common/empty-state";
import { cn } from "@/lib/utils";
import { ErrorState } from "./error-state";
import { PageStateProps } from "./types";

function extractErrorMessage(error: unknown): string | undefined {
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message: unknown }).message;
    if (typeof msg === "string") return msg;
    if (msg) return String(msg);
  }
  return undefined;
}

export function PageState({
  isLoading,
  isError,
  error,
  onRetry,
  errorTitle,
  errorProps,
  isEmpty = false,
  empty,
  loading,
  children,
  className,
}: PageStateProps) {
  // 1. Estado de carga (Loading)
  if (isLoading) {
    if (loading) {
      return (
        <div aria-busy="true" aria-live="polite" className={className}>
          {loading}
        </div>
      );
    }
    return (
      <div aria-busy="true" aria-live="polite" className={cn("space-y-4", className)}>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  // 2. Estado de error (Error)
  if (isError) {
    const errorDescription = errorProps?.description ?? extractErrorMessage(error);
    return (
      <ErrorState
        title={errorProps?.title ?? errorTitle}
        description={errorDescription}
        onRetry={errorProps?.onRetry ?? onRetry}
        className={cn(className, errorProps?.className)}
      />
    );
  }

  // 3. Estado vacío (Empty)
  if (isEmpty) {
    return (
      <EmptyState
        title="No hay registros disponibles"
        description="No se encontraron elementos para mostrar en esta sección."
        {...empty}
        className={cn(className, empty?.className)}
      />
    );
  }

  // 4. Contenido renderizado
  return <>{children}</>;
}
