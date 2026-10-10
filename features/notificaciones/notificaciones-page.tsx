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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useListFilters } from "@/hooks/use-list-filters";
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

  // Filtros reactivos sincronizados con la URL
  const filterDefs = React.useMemo(() => createNotificacionFilterDefs(), []);
  const listFilters = useListFilters(filterDefs);

  const search = listFilters.getString("search");
  const estado = listFilters.getString("estado") as EstadoNotificacionFiltro | undefined;
  const tipo = listFilters.getString("tipo") as TipoNotificacion | "all" | undefined;

  // Manejo de paginación por cursores
  const limit = NOTIFICACIONES_PAGINACION_DEFAULT.limitBandeja;
  const [cursorHistory, setCursorHistory] = React.useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  const currentCursor = cursorHistory[pageIndex] ?? null;

  // Reset de cursores al cambiar filtros
  const [prevFilters, setPrevFilters] = React.useState({ search, estado, tipo });
  if (prevFilters.search !== search || prevFilters.estado !== estado || prevFilters.tipo !== tipo) {
    setPrevFilters({ search, estado, tipo });
    setCursorHistory([null]);
    setPageIndex(0);
  }

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
    cursor: currentCursor,
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

  // Navegación por cursores
  const handleNextPage = () => {
    if (notificacionesData?.hasMore && notificacionesData?.nextCursor) {
      setCursorHistory((prev) => [...prev.slice(0, pageIndex + 1), notificacionesData.nextCursor]);
      setPageIndex((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
    }
  };

  // Mutations
  const marcarLeidaMutation = useMarcarNotificacionLeidaMutation();
  const marcarTodasMutation = useMarcarTodasLeidasMutation();
  const eliminarMutation = useEliminarNotificacionMutation();
  const eliminarLeidasMutation = useEliminarTodasLeidasMutation();

  const handleMarcarLeida = (id: string) => {
    marcarLeidaMutation.mutate(id);
  };

  const handleEliminar = (id: string) => {
    eliminarMutation.mutate(id);
  };

  const handleLimpiarLeidasConfirm = () => {
    eliminarLeidasMutation.mutate(undefined, {
      onSuccess: () => setConfirmLimpiarOpen(false),
    });
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

          {/* Barra de paginación por cursor */}
          <div className="pt-2">
            <DataTableCursorPagination
              hasNextPage={Boolean(notificacionesData?.hasMore && notificacionesData?.nextCursor)}
              hasPreviousPage={pageIndex > 0}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              isLoading={isLoading || isFetching}
              loadedCount={notificaciones.length}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmación para limpiar leídas */}
      <AlertDialog open={confirmLimpiarOpen} onOpenChange={setConfirmLimpiarOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar notificaciones leídas?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará de forma permanente todas las notificaciones de tu bandeja que
              ya han sido leídas. Las notificaciones pendientes se mantendrán intactas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLimpiarLeidasConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={eliminarLeidasMutation.isPending}
            >
              {eliminarLeidasMutation.isPending ? "Eliminando..." : "Sí, eliminar leídas"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
