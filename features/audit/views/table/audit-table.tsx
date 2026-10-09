"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { ListToolbar } from "@/components/common/list-toolbar";
import { useListFilters, type UseListFiltersResult } from "@/hooks/use-list-filters";
import { getAuditColumns } from "./columns/audit-columns";
import { useAuditQuery } from "../../hooks/use-audit-query";
import { AuditDetailModal } from "../../components/modals/audit-detail-modal";
import { auditFilterDefs } from "../../config/filters";
import { getAuditActionMeta } from "../../consts";
import type { AuditLogItem } from "../../types/audit.types";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  EyeIcon,
  Layers01Icon,
  Robot01Icon,
  ShieldCheckIcon,
} from "@hugeicons/core-free-icons";
import { formatDateTime } from "@/lib/formatters/date";
import {
  subDays,
  addDays,
  format,
  differenceInCalendarDays,
  parseISO,
  isValid,
  isAfter,
} from "date-fns";

interface AuditMobileCardProps {
  item: AuditLogItem;
  onViewDetail: (item: AuditLogItem) => void;
}

function AuditMobileCard({ item, onViewDetail }: AuditMobileCardProps) {
  const isSystem = !item.usuario || item.usuario.toLowerCase() === "sistema";
  const actionMeta = getAuditActionMeta(item.accion);

  return (
    <div className="border-border/60 bg-card space-y-3 rounded-2xl border p-4 shadow-2xs">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {isSystem ? (
            <div className="border-border bg-muted/60 text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full border">
              <HugeiconsIcon icon={Robot01Icon} className="size-4" />
            </div>
          ) : (
            <div className="bg-primary/10 text-primary border-primary/20 flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
              {item.usuario.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-foreground text-xs font-semibold">
              {isSystem ? "Sistema" : item.usuario}
            </span>
            <span className="text-muted-foreground text-xs">
              {formatDateTime(item.registradoEn)}
            </span>
          </div>
        </div>
        <StatusBadge tone={actionMeta.tone} dot size="sm">
          {actionMeta.label}
        </StatusBadge>
      </div>

      <div className="border-border/40 text-muted-foreground flex items-center justify-between gap-2 border-t pt-2.5 text-xs">
        <div className="flex min-w-0 items-center gap-1.5 truncate">
          <HugeiconsIcon icon={Layers01Icon} className="size-3.5 shrink-0" />
          <span className="truncate capitalize">{item.entidad}</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onViewDetail(item)}
          className="hover:bg-primary/10 hover:text-primary h-8 gap-1.5 rounded-full px-3 text-xs font-medium"
          aria-label={`Ver detalle del evento #${item.id}`}
        >
          <HugeiconsIcon icon={EyeIcon} className="size-3.5" />
          <span>Ver detalle</span>
        </Button>
      </div>
    </div>
  );
}

export function AuditTable() {
  const rawListFilters = useListFilters(auditFilterDefs);

  // Límite superior: hoy
  const todayStr = React.useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  // Rango de fechas predeterminado: últimos 7 días
  const defaultStartStr = React.useMemo(() => format(subDays(new Date(), 7), "yyyy-MM-dd"), []);

  // Controlador con validación y acotado estricto de fechas (máx. 31 días y maxDate hoy)
  const listFilters = React.useMemo<UseListFiltersResult>(() => {
    return {
      ...rawListFilters,
      setFilters: (next) => {
        let fromVal = next.fechaInicio;
        let toVal = next.fechaFin;

        if (fromVal && fromVal > todayStr) {
          fromVal = todayStr;
        }
        if (toVal && toVal > todayStr) {
          toVal = todayStr;
        }

        if (fromVal && toVal) {
          const fromDate = parseISO(fromVal);
          const toDate = parseISO(toVal);

          if (isValid(fromDate) && isValid(toDate)) {
            if (isAfter(fromDate, toDate)) {
              toVal = fromVal;
            } else {
              const diffDays = differenceInCalendarDays(toDate, fromDate);
              if (diffDays > 31) {
                const maxAllowed = addDays(fromDate, 31);
                const capped = isAfter(maxAllowed, new Date()) ? new Date() : maxAllowed;
                toVal = format(capped, "yyyy-MM-dd");
              }
            }
          }
        }

        rawListFilters.setFilters({
          ...next,
          ...(next.fechaInicio !== undefined ? { fechaInicio: fromVal } : {}),
          ...(next.fechaFin !== undefined ? { fechaFin: toVal } : {}),
        });
      },
      setFilter: (key, value) => {
        if (key === "fechaInicio" || key === "fechaFin") {
          let clampedValue = value;
          if (clampedValue && typeof clampedValue === "string" && clampedValue > todayStr) {
            clampedValue = todayStr;
          }
          rawListFilters.setFilter(key, clampedValue);
          return;
        }
        rawListFilters.setFilter(key, value);
      },
    };
  }, [rawListFilters, todayStr]);

  const urlUser = listFilters.getString("usuario");
  const accionRaw = listFilters.getString("accion");
  const entidadRaw = listFilters.getString("entidad");
  const fechaInicioRaw = listFilters.getString("fechaInicio");
  const fechaFinRaw = listFilters.getString("fechaFin");

  const accion = accionRaw && accionRaw !== "all" ? accionRaw : undefined;
  const entidad = entidadRaw && entidadRaw !== "all" ? entidadRaw : undefined;
  const fechaInicio = fechaInicioRaw || defaultStartStr;
  const fechaFin = fechaFinRaw || todayStr;

  const limit = 50;

  // Navegación por cursor con historial de páginas
  const [cursorHistory, setCursorHistory] = React.useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  const currentCursor = cursorHistory[pageIndex] ?? null;

  // Reiniciar cursor al cambiar filtros
  const [prevFilters, setPrevFilters] = React.useState({
    urlUser,
    accion,
    entidad,
    fechaInicio,
    fechaFin,
  });

  if (
    prevFilters.urlUser !== urlUser ||
    prevFilters.accion !== accion ||
    prevFilters.entidad !== entidad ||
    prevFilters.fechaInicio !== fechaInicio ||
    prevFilters.fechaFin !== fechaFin
  ) {
    setPrevFilters({ urlUser, accion, entidad, fechaInicio, fechaFin });
    setCursorHistory([null]);
    setPageIndex(0);
  }

  // Validación de rango de fechas de consulta (escenarios de negocio: máx. 31 días)
  const validationError = React.useMemo(() => {
    if (!fechaInicio || !fechaFin) return null;

    const startDate = parseISO(fechaInicio);
    const endDate = parseISO(fechaFin);

    if (!isValid(startDate) || !isValid(endDate)) {
      return "Formato de fecha inválido.";
    }

    if (isAfter(startDate, endDate)) {
      return "La fecha final no puede ser anterior a la fecha inicial.";
    }

    const diffDays = differenceInCalendarDays(endDate, startDate);
    if (diffDays > 31) {
      return "El rango de consulta no puede superar los 31 días.";
    }

    return null;
  }, [fechaInicio, fechaFin]);

  // Consulta al backend con React Query
  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useAuditQuery({
    cursor: currentCursor,
    limit,
    fechaInicio: !validationError ? fechaInicio : undefined,
    fechaFin: !validationError ? fechaFin : undefined,
    usuario: urlUser.trim() ? urlUser.trim() : undefined,
    accion,
    entidad,
  });

  const auditLogs = response?.data ?? [];

  const handleNextPage = () => {
    if (response?.nextCursor) {
      setCursorHistory((prev) => [...prev.slice(0, pageIndex + 1), response.nextCursor]);
      setPageIndex((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
    }
  };

  // Modal de Detalle
  const [selectedAuditId, setSelectedAuditId] = React.useState<number | null>(null);
  const [detailModalOpen, setDetailModalOpen] = React.useState<boolean>(false);

  const handleViewDetail = React.useCallback((item: AuditLogItem) => {
    setSelectedAuditId(item.id);
    setDetailModalOpen(true);
  }, []);

  const columns = React.useMemo(
    () => getAuditColumns({ onViewDetail: handleViewDetail }),
    [handleViewDetail],
  );

  return (
    <div className="space-y-4">
      {/* Barra de herramientas accesible con filtros declarativos */}
      <ListToolbar
        filterDefs={auditFilterDefs}
        listFilters={listFilters}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        hasActiveFilters={listFilters.hasActive}
        onClearFilters={listFilters.clearFilters}
      />

      {/* Alerta de validación en caso de manipulación de fechas en URL */}
      {validationError && (
        <div
          role="alert"
          className="border-destructive/25 bg-destructive/10 text-destructive animate-in fade-in flex items-center gap-2 rounded-2xl border p-3 text-xs font-medium"
        >
          <HugeiconsIcon icon={AlertCircleIcon} className="size-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Metadatos de seguridad y conteo de página */}
      <div className="text-muted-foreground flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-1.5">
          <HugeiconsIcon icon={ShieldCheckIcon} className="text-primary size-3.5 shrink-0" />
          <span>
            Registros inmutables con retención histórica total. Ordenados del más reciente al más
            antiguo.
          </span>
        </div>
        <span>
          Página: <strong className="text-foreground">{pageIndex + 1}</strong>
        </span>
      </div>

      {/* Tabla Principal como tarjeta única con soporte de reintento y vista móvil */}
      <DataTable
        columns={columns}
        data={validationError ? [] : auditLogs}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        hasActiveFilters={listFilters.hasActive}
        emptyMessage="No hay registros de auditoría para los filtros seleccionados."
        emptyState={{
          title: "Sin registros de auditoría",
          description:
            "No se encontraron eventos registrados para los filtros o rango de fechas seleccionado.",
        }}
        caption="Registros de la bitácora de auditoría"
        mobileCard={(item) => <AuditMobileCard item={item} onViewDetail={handleViewDetail} />}
        cursorPagination={{
          hasNextPage: Boolean(response?.hasMore && response?.nextCursor),
          hasPreviousPage: pageIndex > 0,
          onNextPage: handleNextPage,
          onPreviousPage: handlePreviousPage,
          isLoading: isFetching,
          loadedCount: auditLogs.length,
        }}
      />

      {/* Modal de Detalle */}
      <AuditDetailModal
        auditId={selectedAuditId}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </div>
  );
}
