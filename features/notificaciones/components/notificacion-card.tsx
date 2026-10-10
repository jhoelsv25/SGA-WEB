"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircleIcon,
  Clock01Icon,
  Delete02Icon,
  InformationCircleIcon,
  Tick02Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { NotificacionItem, TipoNotificacion } from "../types";

interface NotificacionCardProps {
  notificacion: NotificacionItem;
  onMarcarLeida?: (id: string) => void;
  onEliminar?: (id: string) => void;
  isMarkingRead?: boolean;
  isDeleting?: boolean;
}

const ICONO_CONFIG: Record<
  TipoNotificacion,
  {
    icon: typeof InformationCircleIcon;
    bgClass: string;
    textClass: string;
    badgeLabel: string;
    badgeVariant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  informacion: {
    icon: InformationCircleIcon,
    bgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    textClass: "text-blue-600 dark:text-blue-400",
    badgeLabel: "Información",
    badgeVariant: "secondary",
  },
  alerta: {
    icon: AlertCircleIcon,
    bgClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900",
    textClass: "text-rose-600 dark:text-rose-400",
    badgeLabel: "Alerta",
    badgeVariant: "destructive",
  },
  recordatorio: {
    icon: Clock01Icon,
    bgClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    textClass: "text-amber-600 dark:text-amber-400",
    badgeLabel: "Recordatorio",
    badgeVariant: "outline",
  },
};

function formatFecha(fechaIso: string): string {
  try {
    const fecha = new Date(fechaIso);
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMin < 1) return "Justo ahora";
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHoras < 24) return `Hace ${diffHoras} h`;
    if (diffDias === 1) return "Ayer";
    if (diffDias < 7) return `Hace ${diffDias} días`;

    return fecha.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return fechaIso;
  }
}

export function NotificacionCard({
  notificacion,
  onMarcarLeida,
  onEliminar,
  isMarkingRead = false,
  isDeleting = false,
}: NotificacionCardProps) {
  const config = ICONO_CONFIG[notificacion.tipo] || ICONO_CONFIG.informacion;
  const fechaFormateada = formatFecha(notificacion.creadoEn);

  return (
    <Card
      className={cn(
        "border transition-all duration-200 hover:shadow-sm",
        notificacion.leida
          ? "bg-card/50 border-border/60 opacity-90"
          : "bg-card border-primary/20 shadow-xs",
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Icono del tipo */}
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
              config.bgClass,
            )}
          >
            <HugeiconsIcon icon={config.icon} className="h-5 w-5" />
          </div>

          {/* Contenido principal */}
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {!notificacion.leida && (
                  <span
                    className="bg-primary ring-primary/20 h-2 w-2 rounded-full ring-2"
                    title="No leída"
                  />
                )}
                <h4
                  className={cn(
                    "text-foreground truncate text-sm leading-tight font-semibold sm:text-base",
                    !notificacion.leida && "font-bold",
                  )}
                >
                  {notificacion.titulo}
                </h4>
                <Badge variant={config.badgeVariant} className="h-4 px-1.5 py-0 text-[10px]">
                  {config.badgeLabel}
                </Badge>
              </div>

              <time className="text-muted-foreground shrink-0 text-xs">{fechaFormateada}</time>
            </div>

            <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-line sm:text-sm">
              {notificacion.mensaje}
            </p>

            {/* Acciones de la tarjeta */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {notificacion.enlaceUrl && (
                <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" asChild>
                  <Link href={notificacion.enlaceUrl}>
                    Ver expediente
                    <HugeiconsIcon icon={ArrowUpRight01Icon} className="h-3 w-3" />
                  </Link>
                </Button>
              )}

              {!notificacion.leida && onMarcarLeida && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary h-7 gap-1 text-xs"
                  onClick={() => onMarcarLeida(notificacion.id)}
                  disabled={isMarkingRead}
                >
                  <HugeiconsIcon icon={Tick02Icon} className="h-3.5 w-3.5" />
                  Marcar leída
                </Button>
              )}

              {onEliminar && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-auto h-7 gap-1 text-xs"
                  onClick={() => onEliminar(notificacion.id)}
                  disabled={isDeleting}
                >
                  <HugeiconsIcon icon={Delete02Icon} className="h-3.5 w-3.5" />
                  Eliminar
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
