"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { getAuditColumns } from "./columns/audit-columns";
import { useAuditQuery } from "../../hooks/use-audit-query";
import { AuditDetailModal } from "../../components/modals/audit-detail-modal";
import type { AuditLogItem } from "../../types/audit.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  FilterIcon,
  AlertCircleIcon,
  RefreshIcon,
  ShieldCheckIcon,
} from "@hugeicons/core-free-icons";
import { subDays, addDays, format, differenceInCalendarDays, parseISO, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/common/date-picker";

export function AuditTable() {
  // Límite superior: hoy a fin de día
  const today = React.useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  }, []);

  // Rango de fechas por defecto: últimos 7 días
  const todayStr = React.useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const defaultStartStr = React.useMemo(() => format(subDays(new Date(), 7), "yyyy-MM-dd"), []);

  const [fechaInicio, setFechaInicio] = React.useState<string>(defaultStartStr);
  const [fechaFin, setFechaFin] = React.useState<string>(todayStr);
  const [searchUser, setSearchUser] = React.useState<string>("");
  const [accion, setAccion] = React.useState<string>("all");
  const [entidad, setEntidad] = React.useState<string>("all");
  const [page, setPage] = React.useState<number>(1);
  const limit = 50;

  const parsedStartDate = React.useMemo(() => {
    if (!fechaInicio) return undefined;
    const [y, m, d] = fechaInicio.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [fechaInicio]);

  const parsedEndDate = React.useMemo(() => {
    if (!fechaFin) return undefined;
    const [y, m, d] = fechaFin.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [fechaFin]);

  // Regla de negocio de la bitácora: rango máx 31 días y fechas cronológicas
  const handleFechaDesdeChange = (newDate: Date | undefined) => {
    if (!newDate) {
      setFechaInicio("");
      setPage(1);
      return;
    }
    const newStr = format(newDate, "yyyy-MM-dd");
    setFechaInicio(newStr);
    setPage(1);

    if (parsedEndDate) {
      if (parsedEndDate < newDate) {
        setFechaFin(newStr);
      } else {
        const diff = differenceInCalendarDays(parsedEndDate, newDate);
        if (diff > 31) {
          const maxAllowed = addDays(newDate, 31);
          const capped = maxAllowed > today ? today : maxAllowed;
          setFechaFin(format(capped, "yyyy-MM-dd"));
        }
      }
    }
  };

  const handleFechaHastaChange = (newDate: Date | undefined) => {
    if (!newDate) {
      setFechaFin("");
      setPage(1);
      return;
    }
    const newStr = format(newDate, "yyyy-MM-dd");
    setFechaFin(newStr);
    setPage(1);

    if (parsedStartDate) {
      if (parsedStartDate > newDate) {
        setFechaInicio(newStr);
      } else {
        const diff = differenceInCalendarDays(newDate, parsedStartDate);
        if (diff > 31) {
          const minAllowed = subDays(newDate, 31);
          setFechaInicio(format(minAllowed, "yyyy-MM-dd"));
        }
      }
    }
  };

  // Validación de Rango de Fechas (Gherkin Scenarios)
  const validationError = React.useMemo(() => {
    if (!fechaInicio || !fechaFin) return null;

    const startDate = parseISO(fechaInicio);
    const endDate = parseISO(fechaFin);

    if (!isValid(startDate) || !isValid(endDate)) {
      return "Formato de fecha inválido.";
    }

    if (endDate < startDate) {
      return "La fecha final no puede ser anterior a la fecha inicial.";
    }

    const diffDays = differenceInCalendarDays(endDate, startDate);
    if (diffDays > 31) {
      return "El rango de consulta no puede superar los 31 días.";
    }

    return null;
  }, [fechaInicio, fechaFin]);

  // Consulta al Backend con React Query
  const {
    data: response,
    isLoading,
    refetch,
    isFetching,
  } = useAuditQuery({
    page,
    limit,
    fechaInicio: !validationError ? fechaInicio : undefined,
    fechaFin: !validationError ? fechaFin : undefined,
    usuario: searchUser.trim() ? searchUser.trim() : undefined,
    accion: accion !== "all" ? accion : undefined,
    entidad: entidad !== "all" ? entidad : undefined,
  });

  const auditLogs = response?.data ?? [];

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

  const handleResetFilters = () => {
    setFechaInicio(defaultStartStr);
    setFechaFin(todayStr);
    setSearchUser("");
    setAccion("all");
    setEntidad("all");
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-card border-border/70 space-y-3 rounded-3xl border p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary border-primary/20 flex size-9 items-center justify-center rounded-full border">
              <HugeiconsIcon icon={FilterIcon} className="size-4.5" />
            </div>
            <div>
              <h3 className="text-foreground text-xs font-bold">Filtros de Trazabilidad</h3>
              <p className="text-muted-foreground text-[11px]">
                Consulta eventos por rango (máx. 31 días), usuario o módulo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="text-muted-foreground hover:text-foreground h-9 rounded-full px-3.5 text-xs"
            >
              Restablecer
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading || isFetching || !!validationError}
              className="h-9 gap-1.5 rounded-full px-4 text-xs font-semibold"
            >
              <HugeiconsIcon
                icon={RefreshIcon}
                className={cn("size-3.5", isFetching && "animate-spin")}
              />
              <span>Actualizar</span>
            </Button>
          </div>
        </div>

        {/* Fila de Controles */}
        <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Búsqueda por Usuario */}
          <div className="space-y-1">
            <span className="text-muted-foreground px-1 text-[11px] font-semibold">Usuario</span>
            <Input
              placeholder="admin, Sistema..."
              value={searchUser}
              onChange={(e) => {
                setSearchUser(e.target.value);
                setPage(1);
              }}
              startIcon={<HugeiconsIcon icon={Search01Icon} className="size-4" />}
              className="h-10 text-xs"
            />
          </div>

          {/* Fecha Inicial */}
          <div className="space-y-1">
            <span className="text-muted-foreground px-1 text-[11px] font-semibold">
              Fecha Desde
            </span>
            <DatePicker
              date={parsedStartDate}
              onSelect={handleFechaDesdeChange}
              maxDate={today}
              dateFormat="dd/MM/yyyy"
              placeholder="dd/mm/aaaa"
              clearable={false}
              className="h-10 w-full rounded-full text-xs"
            />
          </div>

          {/* Fecha Final */}
          <div className="space-y-1">
            <span className="text-muted-foreground px-1 text-[11px] font-semibold">
              Fecha Hasta
            </span>
            <DatePicker
              date={parsedEndDate}
              onSelect={handleFechaHastaChange}
              minDate={parsedStartDate}
              maxDate={
                parsedStartDate
                  ? addDays(parsedStartDate, 31) > today
                    ? today
                    : addDays(parsedStartDate, 31)
                  : today
              }
              dateFormat="dd/MM/yyyy"
              placeholder="dd/mm/aaaa"
              clearable={false}
              className="h-10 w-full rounded-full text-xs"
            />
          </div>

          {/* Filtro Acción */}
          <div className="space-y-1">
            <span className="text-muted-foreground px-1 text-[11px] font-semibold">Acción</span>
            <Select
              value={accion}
              onValueChange={(val) => {
                setAccion(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 rounded-full text-xs">
                <SelectValue placeholder="Todas las acciones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las acciones</SelectItem>
                <SelectItem value="crear">Crear</SelectItem>
                <SelectItem value="actualizar">Actualizar</SelectItem>
                <SelectItem value="eliminar">Eliminar</SelectItem>
                <SelectItem value="iniciar_sesion">Inicio de sesión</SelectItem>
                <SelectItem value="cerrar_sesion">Cierre de sesión</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro Entidad */}
          <div className="space-y-1">
            <span className="text-muted-foreground px-1 text-[11px] font-semibold">Entidad</span>
            <Select
              value={entidad}
              onValueChange={(val) => {
                setEntidad(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 rounded-full text-xs">
                <SelectValue placeholder="Todas las entidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las entidades</SelectItem>
                <SelectItem value="usuarios">Usuarios</SelectItem>
                <SelectItem value="roles">Roles</SelectItem>
                <SelectItem value="menus">Menús</SelectItem>
                <SelectItem value="personas">Personas</SelectItem>
                <SelectItem value="institucion">Institución</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Alerta de Error de Validación (Gherkin Requirement) */}
        {validationError && (
          <div className="bg-destructive/10 border-destructive/20 text-destructive animate-in fade-in flex items-center gap-2 rounded-2xl border p-2.5 text-xs font-medium">
            <HugeiconsIcon icon={AlertCircleIcon} className="size-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Nota de Seguridad e Inmutabilidad */}
      <div className="text-muted-foreground flex items-center justify-between px-3 py-1 text-xs">
        <div className="flex items-center gap-1.5">
          <HugeiconsIcon icon={ShieldCheckIcon} className="text-primary size-3.5" />
          <span>
            Registros inmutables con retención histórica total. Ordenados del más reciente al más
            antiguo.
          </span>
        </div>
        <span>
          Total de eventos: <strong className="text-foreground">{response?.total ?? 0}</strong>
        </span>
      </div>

      {/* Tabla Principal */}
      <div className="bg-card border-border/70 rounded-3xl border p-4 shadow-xs">
        <DataTable
          columns={columns}
          data={validationError ? [] : auditLogs}
          isLoading={isLoading}
          emptyMessage="No hay registros de auditoría para los filtros seleccionados."
          pagination={true}
        />
      </div>

      {/* Modal de Detalle */}
      <AuditDetailModal
        auditId={selectedAuditId}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </div>
  );
}
