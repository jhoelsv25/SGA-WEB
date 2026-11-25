"use client";

import * as React from "react";
import {
  PlusSignIcon,
  FilterIcon,
  RefreshIcon,
  Copy01Icon,
  School01Icon,
  UserGroupIcon,
  UserCheck01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { SelectOption } from "@/components/common/select";
import { EmptyState } from "@/components/common/empty-state";
import { TableSkeleton } from "@/components/common/skeletons";
import { ErrorState } from "@/components/common/page-state";
import { useGradosQuery, type Grado } from "@/features/grados";
import { ExportarHorariosDropdown } from "@/features/horarios";
import { ImportarButton } from "@/features/importacion";
import {
  useCerrarSeccionMutation,
  useCreateSeccionMutation,
  usePuedeGestionarSecciones,
  useSeccionesQuery,
  useUpdateSeccionMutation,
} from "../hooks";
import { CreateSeccionModal } from "../components/modals/create-seccion-modal";
import { EditSeccionModal } from "../components/modals/edit-seccion-modal";
import { ClonarSeccionesModal } from "../components/modals/clonar-secciones-modal";
import { getSeccionColumns } from "./columns/seccion-columns";
import type { EstadoSeccion, Seccion } from "../types";
import type { CreateSeccionFormValues, UpdateSeccionFormValues } from "../schemas";

export function SeccionesTable() {
  const puedeGestionar = usePuedeGestionarSecciones();

  // Filtros locales
  const [selectedGradoId, setSelectedGradoId] = React.useState<string>("all");
  const [selectedEstado, setSelectedEstado] = React.useState<string>("all");

  // Grados para filtro y formularios
  const { data: grados = [], isLoading: isLoadingGrados } = useGradosQuery();

  const queryParams = React.useMemo(() => {
    return {
      ...(selectedGradoId !== "all" ? { gradoId: selectedGradoId } : {}),
      ...(selectedEstado !== "all" ? { estado: selectedEstado as EstadoSeccion } : {}),
    };
  }, [selectedGradoId, selectedEstado]);

  // Query principal de secciones
  const {
    data: secciones = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useSeccionesQuery(queryParams);

  // Mutaciones
  const createMutation = useCreateSeccionMutation();
  const updateMutation = useUpdateSeccionMutation();
  const cerrarMutation = useCerrarSeccionMutation();

  // Estados de modales
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [clonarModalOpen, setClonarModalOpen] = React.useState(false);
  const [seccionToEdit, setSeccionToEdit] = React.useState<Seccion | null>(null);

  // Handlers
  const handleOpenEdit = React.useCallback((seccion: Seccion) => {
    setSeccionToEdit(seccion);
    setEditModalOpen(true);
  }, []);

  const handleCerrarSeccion = React.useCallback(
    async (seccion: Seccion) => {
      await cerrarMutation.mutateAsync(seccion.id);
    },
    [cerrarMutation],
  );

  const handleCreateSubmit = async (values: CreateSeccionFormValues) => {
    await createMutation.mutateAsync({
      gradoId: values.gradoId,
      nombre: values.nombre,
      aula: values.aula || undefined,
      vacantes: values.vacantes,
      tutorId: values.tutorId || undefined,
    });
    setCreateModalOpen(false);
  };

  const handleUpdateSubmit = async (values: UpdateSeccionFormValues) => {
    if (!seccionToEdit) return;
    await updateMutation.mutateAsync({
      id: seccionToEdit.id,
      payload: {
        nombre: values.nombre,
        aula: values.aula || undefined,
        vacantes: values.vacantes,
        tutorId: values.tutorId ? values.tutorId : null,
      },
    });
    setEditModalOpen(false);
    setSeccionToEdit(null);
  };

  // Opciones de filtros
  const gradoFilterOptions = React.useMemo(() => {
    return [
      { value: "all", label: "Todos los grados" },
      ...grados.map((g: Grado) => ({
        value: g.id,
        label: `${g.nombre} (${g.numero}.°)`,
      })),
    ];
  }, [grados]);

  const estadoFilterOptions = React.useMemo(() => {
    return [
      { value: "all", label: "Todos los estados" },
      { value: "activa", label: "Solo activas" },
      { value: "cerrada", label: "Solo cerradas" },
    ];
  }, []);

  // Métricas resumidas basadas en las secciones visibles
  const resumen = React.useMemo(() => {
    const total = secciones.length;
    const activas = secciones.filter((s) => s.estado === "activa").length;
    const totalMatriculados = secciones.reduce((acc, s) => acc + s.matriculados, 0);
    const totalVacantes = secciones.reduce((acc, s) => acc + s.vacantes, 0);
    const vacantesLibres = Math.max(0, totalVacantes - totalMatriculados);
    const ocupacionPct =
      totalVacantes > 0 ? Math.round((totalMatriculados / totalVacantes) * 100) : 0;
    const conTutor = secciones.filter((s) => Boolean(s.tutor)).length;
    const cargaCompleta = secciones.filter(
      (s) => s.totalCursos > 0 && s.cursosSinDocente === 0,
    ).length;

    return {
      total,
      activas,
      totalMatriculados,
      totalVacantes,
      vacantesLibres,
      ocupacionPct,
      conTutor,
      sinTutor: Math.max(0, total - conTutor),
      cargaCompleta,
      cargaPendiente: Math.max(0, total - cargaCompleta),
    };
  }, [secciones]);

  // Columnas TanStack
  const columns = React.useMemo(() => {
    return getSeccionColumns({
      puedeGestionar,
      onEdit: handleOpenEdit,
      onCerrar: handleCerrarSeccion,
      isCerrando: cerrarMutation.isPending,
    });
  }, [puedeGestionar, handleOpenEdit, handleCerrarSeccion, cerrarMutation.isPending]);

  return (
    <div className="space-y-4">
      {/* Métricas de Secciones */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Total Secciones</p>
              <p className="text-2xl font-bold tabular-nums">{resumen.total}</p>
              <p className="text-muted-foreground text-[11px]">
                {resumen.activas} activa{resumen.activas === 1 ? "" : "s"}
              </p>
            </div>
            <div className="bg-primary/10 text-primary rounded-full p-2.5">
              <HugeiconsIcon icon={School01Icon} className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Ocupación Escolar</p>
              <p className="text-2xl font-bold text-blue-600 tabular-nums dark:text-blue-400">
                {resumen.totalMatriculados}{" "}
                <span className="text-muted-foreground text-sm font-normal">
                  / {resumen.totalVacantes}
                </span>
              </p>
              <p className="text-muted-foreground text-[11px]">
                {resumen.ocupacionPct}% ocupado · {resumen.vacantesLibres} libres
              </p>
            </div>
            <div className="rounded-full bg-blue-500/10 p-2.5 text-blue-600">
              <HugeiconsIcon icon={UserGroupIcon} className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Con Tutor Asignado</p>
              <p className="text-2xl font-bold text-amber-600 tabular-nums dark:text-amber-400">
                {resumen.conTutor}{" "}
                <span className="text-muted-foreground text-sm font-normal">/ {resumen.total}</span>
              </p>
              <p className="text-muted-foreground text-[11px]">
                {resumen.sinTutor === 0
                  ? "Todas tienen tutor"
                  : `${resumen.sinTutor} sin tutor asignado`}
              </p>
            </div>
            <div className="rounded-full bg-amber-500/10 p-2.5 text-amber-600">
              <HugeiconsIcon icon={UserCheck01Icon} className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Carga Docente Completa</p>
              <p className="text-2xl font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                {resumen.cargaCompleta}{" "}
                <span className="text-muted-foreground text-sm font-normal">/ {resumen.total}</span>
              </p>
              <p className="text-muted-foreground text-[11px]">
                {resumen.cargaPendiente === 0
                  ? "100% de cursos cubiertos"
                  : `${resumen.cargaPendiente} con cursos pendientes`}
              </p>
            </div>
            <div className="rounded-full bg-emerald-500/10 p-2.5 text-emerald-600">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de herramientas y filtros responsivos (360px móvil y escritorio) */}
      <div className="border-border/60 bg-card/60 flex flex-col gap-3 rounded-2xl border p-3.5 shadow-2xs backdrop-blur-xs sm:flex-row sm:items-center sm:justify-between sm:p-4">
        {/* Controles de filtrado */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
          <div className="w-full sm:w-56">
            <SelectOption
              options={gradoFilterOptions}
              value={selectedGradoId}
              onSelect={(val) => setSelectedGradoId(val)}
              placeholder="Filtrar por grado..."
              searchPlaceholder="Buscar grado..."
              disabled={isLoadingGrados}
              className="h-10 min-h-11 w-full text-xs sm:min-h-10"
            />
          </div>

          <div className="w-full sm:w-44">
            <SelectOption
              options={estadoFilterOptions}
              value={selectedEstado}
              onSelect={(val) => setSelectedEstado(val)}
              placeholder="Filtrar por estado..."
              searchPlaceholder="Buscar estado..."
              className="h-10 min-h-11 w-full text-xs sm:min-h-10"
            />
          </div>

          {(selectedGradoId !== "all" || selectedEstado !== "all") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedGradoId("all");
                setSelectedEstado("all");
              }}
              className="text-muted-foreground hover:text-foreground h-10 min-h-11 gap-1 px-2.5 text-xs sm:h-9 sm:min-h-9"
            >
              <HugeiconsIcon icon={FilterIcon} className="size-3.5" />
              <span>Restablecer</span>
            </Button>
          )}
        </div>

        {/* Acciones principales: Nueva sección (Solo si tiene permiso) */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            aria-label="Actualizar listado de secciones"
            className="h-10 min-h-11 gap-1.5 px-3 sm:h-9 sm:min-h-9"
          >
            <HugeiconsIcon
              icon={RefreshIcon}
              className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span className="hidden text-xs sm:inline">Actualizar</span>
          </Button>

          <ExportarHorariosDropdown
            label="Exportar horarios"
            gradoId={selectedGradoId !== "all" ? selectedGradoId : null}
            className="h-10 min-h-11 rounded-xl px-3 font-semibold sm:h-9 sm:min-h-9"
          />

          {puedeGestionar && (
            <>
              <ImportarButton
                tipo="carga_academica"
                label="Importar Carga"
                onSuccess={() => void refetch()}
                className="h-10 min-h-11 rounded-xl px-3 font-semibold sm:h-9 sm:min-h-9"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setClonarModalOpen(true)}
                className="h-10 min-h-11 gap-1.5 rounded-xl px-3 text-xs font-semibold sm:h-9 sm:min-h-9"
              >
                <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
                <span className="hidden sm:inline">Clonar de año anterior</span>
                <span className="sm:hidden">Clonar</span>
              </Button>
              <Button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="shadow-primary/20 h-10 min-h-11 w-full gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-md sm:h-9 sm:min-h-9 sm:w-auto"
              >
                <HugeiconsIcon icon={PlusSignIcon} className="size-4" strokeWidth={2.5} />
                <span>Nueva sección</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Estados de Carga, Error y Datos */}
      {isLoading ? (
        <div aria-busy="true" aria-live="polite" className="space-y-4">
          <TableSkeleton rows={5} />
        </div>
      ) : isError ? (
        <ErrorState
          title="Error al cargar las secciones"
          description={
            error instanceof Error
              ? error.message
              : "No se pudieron obtener las secciones del año académico."
          }
          onRetry={() => refetch()}
        />
      ) : secciones.length === 0 ? (
        <div className="border-border/60 bg-card rounded-2xl border p-8 shadow-2xs">
          <EmptyState
            title={
              selectedGradoId !== "all" || selectedEstado !== "all"
                ? "No se encontraron secciones con los filtros aplicados"
                : "No hay secciones registradas en este año académico"
            }
            description={
              selectedGradoId !== "all" || selectedEstado !== "all"
                ? "Prueba cambiando el grado o estado seleccionado en los filtros superiores."
                : "Comienza creando la primera sección para organizar las aulas y cursos escolares."
            }
            action={
              puedeGestionar && selectedGradoId === "all" && selectedEstado === "all" ? (
                <Button
                  type="button"
                  onClick={() => setCreateModalOpen(true)}
                  className="h-10 min-h-11 gap-1.5 rounded-full px-5 text-xs font-semibold sm:min-h-10"
                >
                  <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                  <span>Crear primera sección</span>
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="border-border/60 bg-card -mx-4 overflow-x-auto rounded-none border-y shadow-2xs sm:mx-0 sm:rounded-2xl sm:border">
          <DataTable
            columns={columns}
            data={secciones}
            isLoading={isLoading || (isFetching && secciones.length === 0)}
            emptyMessage="No se encontraron secciones con los filtros aplicados."
          />
        </div>
      )}

      {/* Modales de Crear y Editar */}
      <CreateSeccionModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        grados={grados}
        defaultGradoId={selectedGradoId !== "all" ? selectedGradoId : undefined}
        onSubmit={handleCreateSubmit}
        isLoading={createMutation.isPending}
      />

      <EditSeccionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        seccion={seccionToEdit}
        grados={grados}
        onSubmit={handleUpdateSubmit}
        isLoading={updateMutation.isPending}
      />

      <ClonarSeccionesModal open={clonarModalOpen} onOpenChange={setClonarModalOpen} />
    </div>
  );
}
