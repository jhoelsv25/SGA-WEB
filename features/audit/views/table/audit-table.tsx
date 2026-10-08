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
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  FilterIcon,
  AlertCircleIcon,
  RefreshIcon,
  ShieldCheckIcon,
  PlusSignIcon,
  PencilEdit02Icon,
  Delete02Icon,
  Login01Icon,
  Logout01Icon,
  BookOpen01Icon,
  Clock01Icon,
  TeacherIcon,
  Award01Icon,
  ComputerIcon,
  Notification01Icon,
  Settings02Icon,
  UserGroupIcon,
  Layers01Icon,
} from "@hugeicons/core-free-icons";
import { subDays, addDays, format, differenceInCalendarDays, parseISO, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/common/date-picker";

const ACCIONES_OPTIONS = [
  {
    value: "crear",
    label: "Crear",
    icon: PlusSignIcon,
    badgeStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    value: "actualizar",
    label: "Actualizar",
    icon: PencilEdit02Icon,
    badgeStyle: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  },
  {
    value: "eliminar",
    label: "Eliminar",
    icon: Delete02Icon,
    badgeStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  {
    value: "iniciar_sesion",
    label: "Inicio de sesión",
    icon: Login01Icon,
    badgeStyle: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  },
  {
    value: "cerrar_sesion",
    label: "Cierre de sesión",
    icon: Logout01Icon,
    badgeStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
] as const;

const ENTIDADES_OPTIONS = [
  {
    value: "seguridad",
    label: "Seguridad y Accesos",
    icon: ShieldCheckIcon,
    badgeStyle: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    scope: "Usuarios, Roles, Sesiones",
  },
  {
    value: "academico",
    label: "Estructura Académica",
    icon: BookOpen01Icon,
    badgeStyle: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    scope: "Cursos, Secciones, Horarios",
  },
  {
    value: "matricula",
    label: "Comunidad y Matrícula",
    icon: UserGroupIcon,
    badgeStyle: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    scope: "Personas, Matrículas, Traslados",
  },
  {
    value: "asistencia",
    label: "Asistencia Escolar",
    icon: Clock01Icon,
    badgeStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    scope: "Marcaciones, Tardanzas, Faltas",
  },
  {
    value: "seguimiento-docente",
    label: "Seguimiento y Evaluación",
    icon: TeacherIcon,
    badgeStyle: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    scope: "Sesiones de Clase, Notas",
  },
  {
    value: "libretas",
    label: "Libretas y Méritos",
    icon: Award01Icon,
    badgeStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    scope: "Libretas SIAGIE, Méritos",
  },
  {
    value: "aula-virtual",
    label: "Aula Virtual",
    icon: ComputerIcon,
    badgeStyle: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    scope: "Unidades, Tareas, Materiales",
  },
  {
    value: "comunicacion",
    label: "Comunicaciones",
    icon: Notification01Icon,
    badgeStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    scope: "Avisos, Convivencia",
  },
  {
    value: "configuracion",
    label: "Configuración General",
    icon: Settings02Icon,
    badgeStyle: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    scope: "Institución, Años, Kioskos",
  },
] as const;

export function AuditTable() {
  const { getParam, setParam, setParams, removeParams } = useUrlFilters({
    resetPageOnFilter: true,
    pageParamKey: "page",
  });

  // Límite superior: hoy a fin de día
  const today = React.useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  }, []);

  // Rango de fechas por defecto: últimos 7 días
  const todayStr = React.useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const defaultStartStr = React.useMemo(() => format(subDays(new Date(), 7), "yyyy-MM-dd"), []);

  // Parámetros leídos de la URL con valores predeterminados seguros
  const fechaInicio = getParam("fechaInicio", defaultStartStr);
  const fechaFin = getParam("fechaFin", todayStr);
  const accion = getParam("accion", "all");
  const entidad = getParam("entidad", "all");
  const limit = 50;

  // Navegación por cursor en frontend con pila de historial
  const [cursorHistory, setCursorHistory] = React.useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = React.useState<number>(0);

  const currentCursor = cursorHistory[pageIndex] ?? null;

  // Reiniciar historial de cursores cuando cambian los filtros
  const [prevAuditFilters, setPrevAuditFilters] = React.useState({
    fechaInicio,
    fechaFin,
    accion,
    entidad,
  });
  if (
    prevAuditFilters.fechaInicio !== fechaInicio ||
    prevAuditFilters.fechaFin !== fechaFin ||
    prevAuditFilters.accion !== accion ||
    prevAuditFilters.entidad !== entidad
  ) {
    setPrevAuditFilters({ fechaInicio, fechaFin, accion, entidad });
    setCursorHistory([null]);
    setPageIndex(0);
  }

  // Estado de búsqueda por usuario con debounce para actualización suave de URL
  const urlUser = getParam("usuario", "");
  const [searchInput, setSearchInput] = React.useState(urlUser);
  const [prevUrlUser, setPrevUrlUser] = React.useState(urlUser);

  if (prevUrlUser !== urlUser) {
    setPrevUrlUser(urlUser);
    setSearchInput(urlUser);
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const next = searchInput.trim();
      const current = urlUser.trim();
      if (next !== current) {
        setParam("usuario", next || null);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, urlUser, setParam]);

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

  // Regla de negocio de la bitácora: rango máx 31 días y fechas cronológicas sincronizadas con URL
  const handleFechaDesdeChange = (newDate: Date | undefined) => {
    if (!newDate) {
      setParam("fechaInicio", null);
      return;
    }
    const newStr = format(newDate, "yyyy-MM-dd");

    if (parsedEndDate) {
      if (parsedEndDate < newDate) {
        setParams({ fechaInicio: newStr, fechaFin: newStr });
        return;
      }
      const diff = differenceInCalendarDays(parsedEndDate, newDate);
      if (diff > 31) {
        const maxAllowed = addDays(newDate, 31);
        const capped = maxAllowed > today ? today : maxAllowed;
        setParams({ fechaInicio: newStr, fechaFin: format(capped, "yyyy-MM-dd") });
        return;
      }
    }
    setParam("fechaInicio", newStr);
  };

  const handleFechaHastaChange = (newDate: Date | undefined) => {
    if (!newDate) {
      setParam("fechaFin", null);
      return;
    }
    const newStr = format(newDate, "yyyy-MM-dd");

    if (parsedStartDate) {
      if (parsedStartDate > newDate) {
        setParams({ fechaInicio: newStr, fechaFin: newStr });
        return;
      }
      const diff = differenceInCalendarDays(newDate, parsedStartDate);
      if (diff > 31) {
        const minAllowed = subDays(newDate, 31);
        setParams({ fechaInicio: format(minAllowed, "yyyy-MM-dd"), fechaFin: newStr });
        return;
      }
    }
    setParam("fechaFin", newStr);
  };

  const handleAccionChange = (val: string) => {
    setParam("accion", val === "all" ? null : val);
  };

  const handleEntidadChange = (val: string) => {
    setParam("entidad", val === "all" ? null : val);
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

  // Consulta al Backend con React Query y cursor
  const {
    data: response,
    isLoading,
    refetch,
    isFetching,
  } = useAuditQuery({
    cursor: currentCursor,
    limit,
    fechaInicio: !validationError ? fechaInicio : undefined,
    fechaFin: !validationError ? fechaFin : undefined,
    usuario: urlUser.trim() ? urlUser.trim() : undefined,
    accion: accion !== "all" ? accion : undefined,
    entidad: entidad !== "all" ? entidad : undefined,
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

  const handleResetFilters = () => {
    removeParams(["usuario", "fechaInicio", "fechaFin", "accion", "entidad"]);
    setSearchInput("");
    setCursorHistory([null]);
    setPageIndex(0);
  };

  const hasActiveFilters = Boolean(
    urlUser.trim() ||
    accion !== "all" ||
    entidad !== "all" ||
    getParam("fechaInicio") ||
    getParam("fechaFin"),
  );

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
              disabled={!hasActiveFilters}
              className="text-muted-foreground hover:text-foreground h-9 rounded-full px-3.5 text-xs transition-opacity disabled:opacity-40"
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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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
            <Select value={accion} onValueChange={handleAccionChange}>
              <SelectTrigger className="h-10 rounded-full px-3 text-xs">
                <SelectValue placeholder="Todas las acciones" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={6}
                className="border-border/80 max-h-64 min-h-24 min-w-56 overflow-y-auto rounded-2xl p-1.5 shadow-xl backdrop-blur-xl"
              >
                <SelectItem
                  value="all"
                  className="hover:bg-accent/80 cursor-pointer rounded-xl py-2 pr-8 pl-2 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="border-primary/20 bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-lg border">
                      <HugeiconsIcon icon={FilterIcon} className="size-3.5" />
                    </div>
                    <span className="text-foreground font-semibold">Todas las acciones</span>
                  </div>
                </SelectItem>
                <SelectSeparator className="my-1" />
                {ACCIONES_OPTIONS.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="hover:bg-accent/80 cursor-pointer rounded-xl py-2 pr-8 pl-2 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-lg border",
                          item.badgeStyle,
                        )}
                      >
                        <HugeiconsIcon icon={item.icon} className="size-3.5" />
                      </div>
                      <span className="text-foreground font-semibold">{item.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro Módulo / Entidad */}
          <div className="space-y-1">
            <span className="text-muted-foreground px-1 text-[11px] font-semibold">Módulo</span>
            <Select value={entidad} onValueChange={handleEntidadChange}>
              <SelectTrigger className="h-10 rounded-full px-3 text-xs">
                <SelectValue placeholder="Todos los módulos" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={6}
                className="border-border/80 max-h-72 min-h-32 min-w-64 overflow-y-auto rounded-2xl p-1.5 shadow-xl backdrop-blur-xl"
              >
                <SelectItem
                  value="all"
                  className="hover:bg-accent/80 cursor-pointer rounded-xl py-2 pr-8 pl-2 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="border-primary/20 bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-lg border">
                      <HugeiconsIcon icon={Layers01Icon} className="size-3.5" />
                    </div>
                    <span className="text-foreground font-semibold">Todos los módulos</span>
                  </div>
                </SelectItem>
                <SelectSeparator className="my-1" />
                {ENTIDADES_OPTIONS.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="hover:bg-accent/80 cursor-pointer rounded-xl py-2 pr-8 pl-2 text-xs transition-colors"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-lg border",
                          item.badgeStyle,
                        )}
                      >
                        <HugeiconsIcon icon={item.icon} className="size-3.5" />
                      </div>
                      <div className="flex min-w-0 flex-col">
                        <span className="text-foreground truncate font-semibold">{item.label}</span>
                        <span className="text-muted-foreground [data-slot=select-value]_&]:hidden truncate text-[10px]">
                          {item.scope}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
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
          Página: <strong className="text-foreground">{pageIndex + 1}</strong>
        </span>
      </div>

      {/* Tabla Principal */}
      <div className="bg-card border-border/70 rounded-3xl border p-4 shadow-xs">
        <DataTable
          columns={columns}
          data={validationError ? [] : auditLogs}
          isLoading={isLoading}
          emptyMessage="No hay registros de auditoría para los filtros seleccionados."
          cursorPagination={{
            hasNextPage: Boolean(response?.hasMore && response?.nextCursor),
            hasPreviousPage: pageIndex > 0,
            onNextPage: handleNextPage,
            onPreviousPage: handlePreviousPage,
            isLoading: isFetching,
            loadedCount: auditLogs.length,
          }}
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
