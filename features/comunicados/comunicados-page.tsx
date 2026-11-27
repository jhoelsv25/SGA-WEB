"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Add01Icon, Megaphone01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PageHeader } from "@/components/common/page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { DataTableCursorPagination } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useListFilters } from "@/hooks/use-list-filters";
import { useCursorPagination } from "@/hooks/use-cursor-pagination";
import { useSession } from "@/features/auth";
import { useGradosQuery } from "@/features/grados/hooks";
import { useSeccionesQuery } from "@/features/secciones/hooks/use-secciones-query";
import { ComunicadoCard, ModalCrearComunicado, ModalDetalleComunicado } from "./components";
import {
  useArchivarComunicadoMutation,
  useComunicadoQuery,
  useComunicadosQuery,
  usePublicarComunicadoMutation,
} from "./hooks";
import { createComunicadoFilterDefs } from "./constants";
import type { ComunicadoItem, DirigidoA, EstadoComunicado, PrioridadComunicado } from "./types";

export function ComunicadosPage() {
  const searchParams = useSearchParams();
  const comunicadoIdParam = searchParams.get("id");

  const { data: sessionData } = useSession();
  const currentUserId = sessionData?.user?.id;
  const activeRole = (sessionData?.user?.activeRoleName ?? "").toLowerCase();
  const puedeRedactar =
    activeRole !== "estudiante" && activeRole !== "apoderado" && Boolean(activeRole);

  // Estados de modales
  const [modalCrearOpen, setModalCrearOpen] = React.useState(false);
  const [comunicadoSeleccionado, setComunicadoSeleccionado] = React.useState<ComunicadoItem | null>(
    null,
  );
  const [modalDetalleOpen, setModalDetalleOpen] = React.useState(false);
  const [paramDismissed, setParamDismissed] = React.useState(false);
  const [defaultTabDetalle, setDefaultTabDetalle] = React.useState<"contenido" | "lecturas">(
    "contenido",
  );

  // Estados de confirmación
  const [comunicadoAPublicar, setComunicadoAPublicar] = React.useState<ComunicadoItem | null>(null);
  const [comunicadoAArchivar, setComunicadoAArchivar] = React.useState<ComunicadoItem | null>(null);

  // Filtros reactivos con URL
  const filterDefs = React.useMemo(() => createComunicadoFilterDefs(), []);
  const listFilters = useListFilters(filterDefs);

  const search = listFilters.getString("search");
  const estado = listFilters.getString("estado") as EstadoComunicado | "all" | undefined;
  const dirigidoA = listFilters.getString("dirigidoA") as DirigidoA | "all" | undefined;
  const prioridad = listFilters.getString("prioridad") as PrioridadComunicado | "all" | undefined;

  // Hook global de paginación por cursores
  const pagination = useCursorPagination({
    resetDeps: [search, estado, dirigidoA, prioridad],
  });

  // Consultas
  const {
    data: comunicadosData,
    isLoading,
    isFetching,
    refetch,
  } = useComunicadosQuery({
    cursor: pagination.cursor,
    limit: 15,
    search: search && search.length >= 2 ? search : undefined,
    estado: estado && estado !== "all" ? estado : undefined,
    dirigidoA: dirigidoA && dirigidoA !== "all" ? dirigidoA : undefined,
    prioridad: prioridad && prioridad !== "all" ? prioridad : undefined,
  });

  const comunicados = React.useMemo(() => comunicadosData?.data ?? [], [comunicadosData?.data]);

  // Apertura automática si viene el id por query param (ej. clic desde la campana de notificaciones)
  const { data: comunicadoParamData } = useComunicadoQuery(
    comunicadoIdParam ?? undefined,
    Boolean(comunicadoIdParam),
  );

  const comunicadoActivo =
    comunicadoSeleccionado ?? (!paramDismissed ? (comunicadoParamData ?? null) : null);
  const isDetalleOpen = modalDetalleOpen || (!paramDismissed && Boolean(comunicadoParamData));

  const handleDetalleOpenChange = (open: boolean) => {
    if (!open) {
      setModalDetalleOpen(false);
      setComunicadoSeleccionado(null);
      if (comunicadoIdParam) {
        setParamDismissed(true);
      }
    } else {
      setModalDetalleOpen(true);
    }
  };

  // Datos auxiliares para modal de creación
  const { data: gradosData } = useGradosQuery();
  const { data: seccionesData } = useSeccionesQuery();

  const gradosList = React.useMemo(
    () => (gradosData ?? []).map((g) => ({ id: g.id, numero: g.numero })),
    [gradosData],
  );

  const seccionesList = React.useMemo(
    () => (seccionesData ?? []).map((s) => ({ id: s.id, nombre: s.nombre, gradoId: s.gradoId })),
    [seccionesData],
  );

  // Mutaciones
  const publicarMutation = usePublicarComunicadoMutation();
  const archivarMutation = useArchivarComunicadoMutation();

  const handleVerDetalle = (comunicado: ComunicadoItem) => {
    setComunicadoSeleccionado(comunicado);
    setDefaultTabDetalle("contenido");
    setModalDetalleOpen(true);
  };

  const handleVerAvanceLectura = (comunicado: ComunicadoItem) => {
    setComunicadoSeleccionado(comunicado);
    setDefaultTabDetalle("lecturas");
    setModalDetalleOpen(true);
  };

  const handlePublicarConfirm = async () => {
    if (comunicadoAPublicar) {
      await publicarMutation.mutateAsync(comunicadoAPublicar.id);
      setComunicadoAPublicar(null);
    }
  };

  const handleArchivarConfirm = async () => {
    if (comunicadoAArchivar) {
      await archivarMutation.mutateAsync(comunicadoAArchivar.id);
      setComunicadoAArchivar(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera institucional */}
      <PageHeader
        title="Comunicados Oficiales"
        description="Publicación de avisos institucionales para la comunidad educativa y control de lectura en tiempo real."
        icon={Megaphone01Icon}
        actions={
          puedeRedactar ? (
            <Button
              size="sm"
              onClick={() => setModalCrearOpen(true)}
              className="h-9 gap-1.5 text-xs font-medium shadow-xs"
            >
              <HugeiconsIcon icon={Add01Icon} className="size-4" />
              Redactar Comunicado
            </Button>
          ) : undefined
        }
      />

      {/* Toolbar reactivo con filtros */}
      <ListToolbar
        filterDefs={filterDefs}
        listFilters={listFilters}
        searchPlaceholder="Buscar por título o contenido..."
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
      />

      {/* Contenido principal */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card space-y-3 rounded-2xl border p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : comunicados.length === 0 ? (
        <EmptyState
          icon={Megaphone01Icon}
          title="No hay comunicados disponibles"
          description={
            search || (estado && estado !== "all") || (dirigidoA && dirigidoA !== "all")
              ? "No se encontraron comunicados con los criterios de filtro seleccionados."
              : "Aún no se han emitido comunicados oficiales en el sistema."
          }
          action={
            search || (estado && estado !== "all") || (dirigidoA && dirigidoA !== "all") ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => listFilters.clearFilters()}
                className="text-xs"
              >
                Restablecer filtros
              </Button>
            ) : puedeRedactar ? (
              <Button size="sm" onClick={() => setModalCrearOpen(true)} className="gap-1.5 text-xs">
                <HugeiconsIcon icon={Add01Icon} className="size-4" />
                Redactar primer comunicado
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {comunicados.map((comunicado) => (
            <ComunicadoCard
              key={comunicado.id}
              comunicado={comunicado}
              currentUserId={currentUserId}
              onVerDetalle={handleVerDetalle}
              onVerAvanceLectura={handleVerAvanceLectura}
              onPublicar={setComunicadoAPublicar}
              onArchivar={setComunicadoAArchivar}
              isPublishing={publicarMutation.isPending}
              isArchiving={archivarMutation.isPending}
            />
          ))}

          {/* Paginación por cursores con hook global */}
          <div className="pt-2">
            <DataTableCursorPagination
              {...pagination.getPaginationProps(comunicadosData)}
              isLoading={isLoading || isFetching}
              loadedCount={comunicados.length}
            />
          </div>
        </div>
      )}

      {/* Modal Redactar Comunicado */}
      <ModalCrearComunicado
        open={modalCrearOpen}
        onOpenChange={setModalCrearOpen}
        grados={gradosList}
        secciones={seccionesList}
      />

      {/* Modal Detalle y Avance de Lectura */}
      <ModalDetalleComunicado
        comunicado={comunicadoActivo}
        open={isDetalleOpen}
        onOpenChange={handleDetalleOpenChange}
        defaultTab={defaultTabDetalle}
        currentUserId={currentUserId}
      />

      {/* Confirmación Publicar Borrador */}
      <ConfirmDialog
        open={Boolean(comunicadoAPublicar)}
        onOpenChange={(val) => !val && setComunicadoAPublicar(null)}
        title="¿Publicar comunicado ahora?"
        description={`Se calcularán los destinatarios y se notificarán de inmediato a través de sus bandejas personales. Un comunicado publicado no se podrá editar.`}
        confirmText="Sí, publicar"
        cancelText="Cancelar"
        variant="info"
        isLoading={publicarMutation.isPending}
        onConfirm={handlePublicarConfirm}
      />

      {/* Confirmación Archivar */}
      <ConfirmDialog
        open={Boolean(comunicadoAArchivar)}
        onOpenChange={(val) => !val && setComunicadoAArchivar(null)}
        title="¿Archivar comunicado?"
        description="El comunicado dejará de mostrarse como vigente en la comunidad, pero se conservará en el historial junto con el registro de sus lecturas."
        confirmText="Sí, archivar"
        cancelText="Cancelar"
        variant="warning"
        isLoading={archivarMutation.isPending}
        onConfirm={handleArchivarConfirm}
      />
    </div>
  );
}
