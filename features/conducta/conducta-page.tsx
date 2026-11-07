"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Add01Icon, Award01Icon, Note01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ModalBuscarMatricula } from "@/features/matriculas/components/modals/modal-buscar-matricula";
import { PageHeader } from "@/components/common/page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { DataTableCursorPagination } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useListFilters } from "@/hooks/use-list-filters";
import { useCursorPagination } from "@/hooks/use-cursor-pagination";
import { useSession } from "@/features/auth";
import {
  IncidenciaCard,
  ModalAnularIncidencia,
  ModalCrearIncidencia,
  ModalCrearObservacion,
  ModalEditarIncidencia,
  ModalResumenEstudiante,
  ObservacionCard,
} from "./components";
import { useIncidenciasQuery, useObservacionesQuery } from "./hooks";
import { createIncidenciasFilterDefs } from "./constants";
import type { GravedadFalta, IncidenciaItem, TipoIncidencia } from "./types";

export function ConductaPage() {
  const searchParams = useSearchParams();
  const matriculaIdParam = searchParams.get("matriculaId") ?? undefined;
  const { data: sessionData } = useSession();
  const currentUserId = sessionData?.user?.id;
  const activeRole = (sessionData?.user?.activeRoleName ?? "").toLowerCase();
  const puedeRegistrar =
    activeRole !== "estudiante" && activeRole !== "apoderado" && Boolean(activeRole);

  const [activeTab, setActiveTab] = React.useState<"incidencias" | "observaciones">("incidencias");

  // Estados de modales
  const [modalCrearIncidenciaOpen, setModalCrearIncidenciaOpen] = React.useState(false);
  const [modalCrearObservacionOpen, setModalCrearObservacionOpen] = React.useState(false);
  const [incidenciaAEditar, setIncidenciaAEditar] = React.useState<IncidenciaItem | null>(null);
  const [incidenciaAAnular, setIncidenciaAAnular] = React.useState<IncidenciaItem | null>(null);
  const [buscarEstudianteOpen, setBuscarEstudianteOpen] = React.useState(false);
  const [resumenMatriculaId, setResumenMatriculaId] = React.useState<string | null>(null);

  // Filtros reactivos con URL
  const filterDefs = React.useMemo(() => createIncidenciasFilterDefs(), []);
  const listFilters = useListFilters(filterDefs);

  const tipo = listFilters.getString("tipo") as TipoIncidencia | "all" | undefined;
  const gravedad = listFilters.getString("gravedad") as GravedadFalta | "all" | undefined;

  // Paginación por cursores para incidencias
  const incidenciasPagination = useCursorPagination({
    resetDeps: [tipo, gravedad, activeTab],
  });

  // Paginación por cursores para observaciones
  const observacionesPagination = useCursorPagination({
    resetDeps: [activeTab],
  });

  // Query de Incidencias
  const {
    data: incidenciasData,
    isLoading: isLoadingIncidencias,
    isFetching: isFetchingIncidencias,
    refetch: refetchIncidencias,
  } = useIncidenciasQuery({
    cursor: incidenciasPagination.cursor,
    limit: 15,
    matriculaId: matriculaIdParam,
    tipo: tipo && tipo !== "all" ? tipo : undefined,
    gravedad: gravedad && gravedad !== "all" ? gravedad : undefined,
  });

  // Query de Observaciones
  const {
    data: observacionesData,
    isLoading: isLoadingObservaciones,
    isFetching: isFetchingObservaciones,
    refetch: _refetchObservaciones,
  } = useObservacionesQuery({
    cursor: observacionesPagination.cursor,
    limit: 15,
    matriculaId: matriculaIdParam,
  });

  const incidencias = incidenciasData?.data ?? [];
  const observaciones = observacionesData?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Cabecera principal */}
      <PageHeader
        title="Conducta y Convivencia"
        description="Gestión integral de méritos, faltas formativas, compromisos y observaciones tutoriales del estudiante."
        icon={Award01Icon}
        actions={
          puedeRegistrar ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalCrearIncidenciaOpen(true)}
                className="gap-1.5 text-xs font-medium"
              >
                <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" />
                Registrar Incidencia
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalCrearObservacionOpen(true)}
                className="gap-1.5 text-xs font-medium"
              >
                <HugeiconsIcon icon={Note01Icon} className="h-4 w-4" />
                Registrar Observación
              </Button>

              <Button
                size="sm"
                onClick={() => setBuscarEstudianteOpen(true)}
                className="gap-1.5 text-xs font-medium"
              >
                <HugeiconsIcon icon={Search01Icon} className="h-4 w-4" />
                Buscar estudiante
              </Button>
            </div>
          ) : undefined
        }
      />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "incidencias" | "observaciones")}
        className="space-y-4"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="incidencias" className="gap-2">
              <HugeiconsIcon icon={Award01Icon} className="h-4 w-4" />
              Incidencias (Méritos y Faltas)
            </TabsTrigger>
            <TabsTrigger value="observaciones" className="gap-2">
              <HugeiconsIcon icon={Note01Icon} className="h-4 w-4" />
              Observaciones Tutoriales
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Incidencias */}
        <TabsContent value="incidencias" className="m-0 space-y-4">
          <ListToolbar
            filterDefs={filterDefs}
            listFilters={listFilters}
            onRefresh={() => void refetchIncidencias()}
            isRefreshing={isFetchingIncidencias}
          />

          {isLoadingIncidencias ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="h-44 w-full rounded-xl" />
            </div>
          ) : incidencias.length === 0 ? (
            <EmptyState
              icon={Award01Icon}
              title="No se encontraron incidencias"
              description="No hay méritos o faltas registradas con los filtros seleccionados."
              action={
                puedeRegistrar ? (
                  <Button onClick={() => setModalCrearIncidenciaOpen(true)} className="gap-2">
                    <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" />
                    Registrar la primera incidencia
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {incidencias.map((inc) => (
                  <IncidenciaCard
                    key={inc.id}
                    incidencia={inc}
                    currentUserId={currentUserId}
                    onEditar={puedeRegistrar ? (item) => setIncidenciaAEditar(item) : undefined}
                    onAnular={puedeRegistrar ? (item) => setIncidenciaAAnular(item) : undefined}
                    onVerResumen={(matId) => setResumenMatriculaId(matId)}
                  />
                ))}
              </div>

              <div className="pt-2">
                <DataTableCursorPagination
                  {...incidenciasPagination.getPaginationProps(incidenciasData)}
                  isLoading={isLoadingIncidencias || isFetchingIncidencias}
                  loadedCount={incidencias.length}
                />
              </div>
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Observaciones */}
        <TabsContent value="observaciones" className="m-0 space-y-4">
          {isLoadingObservaciones ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          ) : observaciones.length === 0 ? (
            <EmptyState
              icon={Note01Icon}
              title="No se encontraron observaciones"
              description="No hay observaciones tutoriales o psicopedagógicas registradas."
              action={
                puedeRegistrar ? (
                  <Button onClick={() => setModalCrearObservacionOpen(true)} className="gap-2">
                    <HugeiconsIcon icon={Note01Icon} className="h-4 w-4" />
                    Registrar la primera observación
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {observaciones.map((obs) => (
                  <ObservacionCard key={obs.id} observacion={obs} />
                ))}
              </div>

              <div className="pt-2">
                <DataTableCursorPagination
                  {...observacionesPagination.getPaginationProps(observacionesData)}
                  isLoading={isLoadingObservaciones || isFetchingObservaciones}
                  loadedCount={observaciones.length}
                />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modales */}
      <ModalCrearIncidencia
        open={modalCrearIncidenciaOpen}
        onOpenChange={setModalCrearIncidenciaOpen}
      />

      <ModalCrearObservacion
        open={modalCrearObservacionOpen}
        onOpenChange={setModalCrearObservacionOpen}
      />

      <ModalEditarIncidencia
        open={Boolean(incidenciaAEditar)}
        onOpenChange={(open) => !open && setIncidenciaAEditar(null)}
        incidencia={incidenciaAEditar}
      />

      <ModalAnularIncidencia
        open={Boolean(incidenciaAAnular)}
        onOpenChange={(open) => !open && setIncidenciaAAnular(null)}
        incidencia={incidenciaAAnular}
      />

      <ModalBuscarMatricula
        open={buscarEstudianteOpen}
        onOpenChange={setBuscarEstudianteOpen}
        description="Elige al estudiante para ver su resumen de conducta."
        onSeleccionar={(m) => setResumenMatriculaId(m.id)}
      />

      <ModalResumenEstudiante
        open={Boolean(resumenMatriculaId)}
        onOpenChange={(open) => !open && setResumenMatriculaId(null)}
        matriculaId={resumenMatriculaId}
      />
    </div>
  );
}
