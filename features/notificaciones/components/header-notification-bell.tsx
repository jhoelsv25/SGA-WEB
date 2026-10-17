"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Cancel01Icon, Notification01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  useMarcarNotificacionLeidaMutation,
  useMarcarTodasLeidasMutation,
  useNotificacionesConteoQuery,
  useNotificacionesQuery,
  useNotificacionesRealtime,
  usePushNotifications,
} from "../hooks";
import type { NotificacionItem } from "../types";
import { formatNotificacionFecha, getNotificacionVisualConfig } from "../utils";

const PUSH_BELL_DISMISSED_KEY = "sga_push_bell_dismissed_until";

export function HeaderNotificationBell() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pushDismissed, setPushDismissed] = React.useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const stored = localStorage.getItem(PUSH_BELL_DISMISSED_KEY);
      if (stored) {
        return Date.now() < Number(stored);
      }
    } catch {
      // ignore
    }
    return false;
  });

  // Escucha activa en tiempo real mediante SSE
  useNotificacionesRealtime();

  const { data: conteoData } = useNotificacionesConteoQuery();
  const unreadCount = conteoData?.unreadCount ?? 0;

  const { data: notificacionesData, isLoading } = useNotificacionesQuery({
    limit: 15,
  });

  const notificaciones = notificacionesData?.data ?? [];

  const marcarLeidaMutation = useMarcarNotificacionLeidaMutation();
  const marcarTodasMutation = useMarcarTodasLeidasMutation();

  const {
    isSupported: isPushSupported,
    isSubscribed: isPushSubscribed,
    permission: pushPermission,
    isLoading: isPushLoading,
    subscribe: subscribePush,
  } = usePushNotifications();

  const handleDismissPush = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPushDismissed(true);
    try {
      // No volver a mostrar en la campanita durante 7 días
      localStorage.setItem(
        PUSH_BELL_DISMISSED_KEY,
        (Date.now() + 7 * 24 * 60 * 60 * 1000).toString(),
      );
    } catch {
      // ignore
    }
  };

  const handleNotificationClick = (item: NotificacionItem) => {
    if (!item.leida) {
      marcarLeidaMutation.mutate(item.id);
    }
    if (item.enlaceUrl) {
      setOpen(false);
      router.push(item.enlaceUrl);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground relative size-9 rounded-full"
          aria-label="Notificaciones"
        >
          <HugeiconsIcon icon={Notification01Icon} className="size-5" />
          {unreadCount > 0 && (
            <span className="bg-destructive text-destructive-foreground animate-in zoom-in-75 absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[10px] font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="border-border/70 w-80 overflow-hidden rounded-2xl p-0 shadow-xl sm:w-96"
      >
        {/* Cabecera del Popover */}
        <div className="border-border/50 bg-muted/30 flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-foreground text-xs font-bold">Notificaciones</span>
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="h-4.5 rounded-full px-1.5 text-[10px] font-semibold"
              >
                {unreadCount} sin leer
              </Badge>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => marcarTodasMutation.mutate()}
              disabled={marcarTodasMutation.isPending}
              className="text-primary hover:text-primary h-7 gap-1 px-2 text-[11px]"
            >
              <HugeiconsIcon icon={Tick02Icon} className="size-3.5" />
              Marcar todas
            </Button>
          )}
        </div>

        {/* Banner para activar Notificaciones Push si no están activas y no fue descartado */}
        {isPushSupported && !isPushSubscribed && !pushDismissed && pushPermission !== "denied" && (
          <div className="bg-primary/10 border-primary/20 flex items-center justify-between gap-2 border-b px-3.5 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <HugeiconsIcon icon={Notification01Icon} className="text-primary size-3.5 shrink-0" />
              <span className="text-foreground truncate text-[11px] font-medium">
                Recibe alertas en este dispositivo
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Button
                size="sm"
                variant="default"
                onClick={() => subscribePush()}
                disabled={isPushLoading}
                className="h-6 shrink-0 rounded-md px-2 text-[10px] font-semibold"
              >
                {isPushLoading ? "..." : "Activar"}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDismissPush}
                className="text-muted-foreground hover:text-foreground size-6 rounded-md p-0"
                title="No mostrar por ahora"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Lista de Notificaciones */}
        <div className="divide-border/40 max-h-84 divide-y overflow-y-auto">
          {isLoading ? (
            <div className="text-muted-foreground py-8 text-center text-xs">
              Cargando notificaciones...
            </div>
          ) : notificaciones.length === 0 ? (
            <div className="space-y-2 py-10 text-center">
              <div className="bg-muted text-muted-foreground mx-auto flex size-10 items-center justify-center rounded-full">
                <HugeiconsIcon icon={Notification01Icon} className="size-5 stroke-1" />
              </div>
              <p className="text-muted-foreground text-xs">No tienes notificaciones.</p>
            </div>
          ) : (
            notificaciones.map((item) => {
              const config = getNotificacionVisualConfig(item.tipo);
              const fechaFormateada = formatNotificacionFecha(item.creadoEn);

              return (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`hover:bg-muted/40 flex cursor-pointer items-start gap-3 p-3.5 text-xs transition-colors ${
                    !item.leida ? "bg-primary/5 font-medium" : "opacity-80"
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 rounded-full p-1.5 ${config.colorClasses}`}>
                    <HugeiconsIcon icon={config.icon} className="size-3.5" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-foreground truncate text-xs font-semibold">
                        {item.titulo}
                      </p>
                      {!item.leida && <span className="bg-primary size-2 shrink-0 rounded-full" />}
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-[11px] leading-relaxed">
                      {item.mensaje}
                    </p>
                    <p className="text-muted-foreground/70 text-[10px]">{fechaFormateada}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pie del Popover */}
        <div className="border-border/50 bg-muted/20 border-t p-2 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setOpen(false);
              router.push("/admin/notificaciones");
            }}
            className="text-muted-foreground hover:text-foreground h-7 w-full text-xs font-medium"
          >
            Ver todas las notificaciones
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
