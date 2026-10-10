"use client";

import * as React from "react";
import {
  Delete02Icon,
  Notification01Icon,
  RefreshIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { NotificacionCard } from "../components/notificacion-card";
import {
  useEliminarNotificacionMutation,
  useEliminarTodasLeidasMutation,
  useMarcarNotificacionLeidaMutation,
  useMarcarTodasLeidasMutation,
  useNotificacionesConteoQuery,
  useNotificacionesQuery,
} from "../hooks";
import type { TipoNotificacion } from "../types";

type TabFiltro = "todas" | "no_leidas" | TipoNotificacion;

export function NotificacionesView() {
  const [tabActual, setTabActual] = React.useState<TabFiltro>("todas");
  const [confirmLimpiarOpen, setConfirmLimpiarOpen] = React.useState(false);

  // Queries
  const { data: conteoData } = useNotificacionesConteoQuery();
  const unreadCount = conteoData?.unreadCount ?? 0;

  const {
    data: notificacionesData,
    isLoading,
    isRefetching,
    refetch,
  } = useNotificacionesQuery({
    limit: 50,
    soloNoLeidas: tabActual === "no_leidas" ? true : undefined,
  });

  const todasNotificaciones = React.useMemo(
    () => notificacionesData?.data ?? [],
    [notificacionesData?.data],
  );

  // Filtrado según la pestaña seleccionada
  const notificacionesFiltradas = React.useMemo(() => {
    if (tabActual === "todas") return todasNotificaciones;
    if (tabActual === "no_leidas") return todasNotificaciones.filter((n) => !n.leida);
    return todasNotificaciones.filter((n) => n.tipo === tabActual);
  }, [todasNotificaciones, tabActual]);

  const totalLeidas = todasNotificaciones.filter((n) => n.leida).length;

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
      {/* Header de la vista */}
      <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              Centro de Notificaciones
            </h1>
            {unreadCount > 0 && (
              <Badge variant="default" className="px-2 py-0.5 text-xs">
                {unreadCount} no {unreadCount === 1 ? "leída" : "leídas"}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Historial de avisos personales, confirmaciones del sistema y alertas escolares.
          </p>
        </div>

        {/* Acciones globales */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="h-8 gap-1 text-xs"
          >
            <HugeiconsIcon
              icon={RefreshIcon}
              className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => marcarTodasMutation.mutate()}
              disabled={marcarTodasMutation.isPending}
              className="h-8 gap-1 text-xs"
            >
              <HugeiconsIcon icon={Tick02Icon} className="h-3.5 w-3.5" />
              Marcar todo como leído
            </Button>
          )}

          {totalLeidas > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmLimpiarOpen(true)}
              disabled={eliminarLeidasMutation.isPending}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 gap-1 text-xs"
            >
              <HugeiconsIcon icon={Delete02Icon} className="h-3.5 w-3.5" />
              Limpiar leídas
            </Button>
          )}
        </div>
      </div>

      {/* Selector de pestañas */}
      <Tabs value={tabActual} onValueChange={(val) => setTabActual(val as TabFiltro)}>
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-5">
          <TabsTrigger value="todas" className="text-xs">
            Todas ({todasNotificaciones.length})
          </TabsTrigger>
          <TabsTrigger value="no_leidas" className="text-xs">
            No leídas ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="informacion" className="text-xs">
            Información
          </TabsTrigger>
          <TabsTrigger value="alerta" className="text-xs">
            Alertas
          </TabsTrigger>
          <TabsTrigger value="recordatorio" className="text-xs">
            Recordatorios
          </TabsTrigger>
        </TabsList>
      </Tabs>

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
      ) : notificacionesFiltradas.length === 0 ? (
        <div className="bg-muted/20 flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
          <div className="bg-muted text-muted-foreground mb-3 flex h-12 w-12 items-center justify-center rounded-2xl">
            <HugeiconsIcon icon={Notification01Icon} className="h-6 w-6" />
          </div>
          <h3 className="text-foreground text-sm font-semibold">No hay notificaciones</h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-xs">
            {tabActual === "no_leidas"
              ? "¡Estás al día! No tienes notificaciones pendientes de leer."
              : "No se encontraron notificaciones en esta categoría."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notificacionesFiltradas.map((notificacion) => (
            <NotificacionCard
              key={notificacion.id}
              notificacion={notificacion}
              onMarcarLeida={handleMarcarLeida}
              onEliminar={handleEliminar}
              isMarkingRead={marcarLeidaMutation.isPending}
              isDeleting={eliminarMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Modal de confirmación para limpiar leídas */}
      <AlertDialog open={confirmLimpiarOpen} onOpenChange={setConfirmLimpiarOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar todas las notificaciones leídas?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará de forma permanente todas las notificaciones que ya fueron
              leídas ({totalLeidas} en total). Las notificaciones sin leer se mantendrán intactas.
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
