"use client";

import * as React from "react";
import Link from "next/link";
import { Delete02Icon, Tick02Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { NotificacionItem } from "../types";
import { formatNotificacionFecha, getNotificacionVisualConfig } from "../utils";

interface NotificacionCardProps {
  notificacion: NotificacionItem;
  onMarcarLeida?: (id: string) => void;
  onEliminar?: (id: string) => void;
  isMarkingRead?: boolean;
  isDeleting?: boolean;
}

export function NotificacionCard({
  notificacion,
  onMarcarLeida,
  onEliminar,
  isMarkingRead = false,
  isDeleting = false,
}: NotificacionCardProps) {
  const config = getNotificacionVisualConfig(notificacion.tipo);
  const fechaFormateada = formatNotificacionFecha(notificacion.creadoEn);

  return (
    <Card
      className={cn(
        "border transition-all duration-200 hover:shadow-sm",
        notificacion.leida
          ? "bg-card border-border/60 opacity-90"
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
                    {notificacion.comunicadoId ? "Ver comunicado" : "Ver detalle"}
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
