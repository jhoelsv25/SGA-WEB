"use client";

import * as React from "react";
import { Delete02Icon, Notification01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
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
import { NotificacionCard } from "./components/notificacion-card";
import {
  useEliminarNotificacionMutation,
  useEliminarTodasLeidasMutation,
  useMarcarNotificacionLeidaMutation,
  useMarcarTodasLeidasMutation,
  useNotificacionesConteoQuery,
  useNotificacionesQuery,
} from "./hooks";
import { NOTIFICACIONES_PAGINACION_DEFAULT, createNotificacionFilterDefs } from "./constants";
import type { EstadoNotificacionFiltro, TipoNotificacion } from "./types";

export function NotificacionesPage() {
  const [confirmLimpiarOpen, setConfirmLimpiarOpen] = React.useState(false);
  const [notificacionAEliminar, setNotificacionAEliminar] = React.useState<string | null>(null);

  // Filtros reactivos sincronizados con la URL
  const filterDefs = React.useMemo(() => createNotificacionFilterDefs(), []);
  const listFilters = useListFilters(filterDefs);

  const search = listFilters.getString("search");
  const estado = listFilters.getString("estado") as EstadoNotificacionFiltro | undefined;
  const tipo = listFilters.getString("tipo") as TipoNotificacion | "all" | undefined;

  // Manejo de paginación por cursores mediante hook global
  const limit = NOTIFICACIONES_PAGINACION_DEFAULT.limitBandeja;
  const pagination = useCursorPagination({
    resetDeps: [search, estado, tipo],
  });

  // Conteo global de no leídas
  const { data: conteoData } = useNotificacionesConteoQuery();
  const unreadCount = conteoData?.unreadCount ?? 0;

  // Consulta de notificaciones con cursor y filtros de backend
  const {
    data: notificacionesData,
    isLoading,
    isFetching,
    refetch,
  } = useNotificacionesQuery({
    cursor: pagination.cursor,
    limit,
    search: search && search.length >= 2 ? search : undefined,
    estado: estado && estado !== "all" ? estado : undefined,
    tipo: tipo && tipo !== "all" ? tipo : undefined,
  });

  const notificaciones = React.useMemo(
    () => notificacionesData?.data ?? [],
    [notificacionesData?.data],
  );

  const totalLeidas = React.useMemo(
    () => notificaciones.filter((n) => n.leida).length,
    [notificaciones],
  );

  // Mutations
  const marcarLeidaMutation = useMarcarNotificacionLeidaMutation();
  const marcarTodasMutation = useMarcarTodasLeidasMutation();
  const eliminarMutation = useEliminarNotificacionMutation();
  const eliminarLeidasMutation = useEliminarTodasLeidasMutation();

  const handleMarcarLeida = (id: string) => {
    marcarLeidaMutation.mutate(id);
  };

  const handleEliminar = (id: string) => {
    setNotificacionAEliminar(id);
  };

  const handleLimpiarLeidasConfirm = async () => {
    await eliminarLeidasMutation.mutateAsync();
    setConfirmLimpiarOpen(false);
  };

  const handleEliminarIndividualConfirm = async () => {
    if (notificacionAEliminar) {
      await eliminarMutation.mutateAsync(notificacionAEliminar);
      setNotificacionAEliminar(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header estandarizado */}
      <PageHeader
        title="Centro de Notificaciones"
        description="Bandeja personal con avisos en tiempo real, alertas de matrículas y confirmaciones del sistema."
        icon={Notification01Icon}
        badge={
          unreadCount > 0
            ? `${unreadCount} ${unreadCount === 1 ? "no leída" : "no leídas"}`
            : undefined
        }
        actions={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => marcarTodasMutation.mutate()}
                disabled={marcarTodasMutation.isPending}
                className="h-9 gap-1.5 text-xs"
              >
                <HugeiconsIcon icon={Tick02Icon} className="h-4 w-4" />
                Marcar todo como leído
              </Button>
            )}

            {totalLeidas > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmLimpiarOpen(true)}
                disabled={eliminarLeidasMutation.isPending}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 gap-1.5 text-xs"
              >
                <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
                Limpiar leídas
              </Button>
            )}
          </div>
        }
      />

      {/* Toolbar estandarizado con filtros y acciones */}
      <ListToolbar
        filterDefs={filterDefs}
        listFilters={listFilters}
        searchPlaceholder="Buscar por título o contenido..."
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
      />

      {/* Contenido de la lista */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card/60 space-y-3 rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notificaciones.length === 0 ? (
        <EmptyState
          icon={Notification01Icon}
          title="No hay notificaciones"
          description={
            search || (estado && estado !== "all") || (tipo && tipo !== "all")
              ? "No se encontraron notificaciones que coincidan con los filtros aplicados."
              : "¡Estás al día! No tienes notificaciones en tu bandeja personal."
          }
          action={
            (search || (estado && estado !== "all") || (tipo && tipo !== "all")) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => listFilters.clearFilters()}
                className="text-xs"
              >
                Restablecer filtros
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {notificaciones.map((notificacion) => (
            <NotificacionCard
              key={notificacion.id}
              notificacion={notificacion}
              onMarcarLeida={handleMarcarLeida}
              onEliminar={handleEliminar}
              isMarkingRead={marcarLeidaMutation.isPending}
              isDeleting={eliminarMutation.isPending}
            />
          ))}

          {/* Barra de paginación por cursor mediante hook global */}
          <div className="pt-2">
            <DataTableCursorPagination
              {...pagination.getPaginationProps(notificacionesData)}
              isLoading={isLoading || isFetching}
              loadedCount={notificaciones.length}
            />
          </div>
        </div>
      )}

      {/* Diálogo de confirmación para limpiar todas las leídas */}
      <ConfirmDialog
        open={confirmLimpiarOpen}
        onOpenChange={setConfirmLimpiarOpen}
        title="¿Eliminar notificaciones leídas?"
        description="Esta acción eliminará de forma permanente todas las notificaciones de tu bandeja que ya han sido leídas. Las notificaciones pendientes se mantendrán intactas."
        confirmText="Sí, eliminar leídas"
        cancelText="Cancelar"
        variant="danger"
        isLoading={eliminarLeidasMutation.isPending}
        onConfirm={handleLimpiarLeidasConfirm}
      />

      {/* Diálogo de confirmación para eliminar notificación individual */}
      <ConfirmDialog
        open={Boolean(notificacionAEliminar)}
        onOpenChange={(val) => !val && setNotificacionAEliminar(null)}
        title="¿Eliminar notificación?"
        description="Esta notificación se eliminará de forma permanente de tu bandeja personal."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={eliminarMutation.isPending}
        onConfirm={handleEliminarIndividualConfirm}
      />
    </div>
  );
}
