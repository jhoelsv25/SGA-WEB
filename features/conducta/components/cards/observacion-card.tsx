"use client";

import * as React from "react";
import {
  Calendar03Icon,
  HelpCircleIcon,
  LockKeyIcon,
  SentIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TIPO_OBSERVACION_CONFIG } from "../../constants";
import type { ObservacionItem } from "../../types";

export interface ObservacionCardProps {
  observacion: ObservacionItem;
}

export function ObservacionCard({ observacion }: ObservacionCardProps) {
  const tipoConfig = TIPO_OBSERVACION_CONFIG[observacion.tipo] ?? {
    label: observacion.tipo,
    color: "bg-muted text-muted-foreground",
  };

  return (
    <Card className="border-border/80 hover:border-primary/40 overflow-hidden border transition-all hover:shadow-xs">
      <CardContent className="space-y-4 p-5">
        {/* Cabecera */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={cn("text-[11px] font-medium", tipoConfig.color)}>
                {tipoConfig.label}
              </Badge>

              {observacion.esConfidencial && (
                <Badge
                  variant="outline"
                  className="gap-1 border-purple-300 bg-purple-500/10 text-[11px] font-medium text-purple-700 dark:border-purple-800 dark:text-purple-400"
                >
                  <HugeiconsIcon icon={LockKeyIcon} className="h-3 w-3" />
                  Confidencial
                </Badge>
              )}

              {observacion.derivadoA && (
                <Badge variant="secondary" className="gap-1 text-[11px] font-medium">
                  <HugeiconsIcon icon={SentIcon} className="h-3 w-3" />
                  Derivado a: {observacion.derivadoA}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-2 pt-0.5">
              <span className="text-foreground text-base font-semibold">
                {observacion.estudianteNombre ?? "Estudiante"}
              </span>
              {observacion.codigoEstudiante && (
                <span className="text-muted-foreground font-mono text-xs">
                  ({observacion.codigoEstudiante})
                </span>
              )}
              {observacion.seccionNombre && (
                <span className="text-muted-foreground text-xs font-medium">
                  • Sección: {observacion.seccionNombre}
                </span>
              )}
            </div>
          </div>

          <div className="text-muted-foreground flex items-center gap-1.5 text-xs sm:text-right">
            <HugeiconsIcon icon={Calendar03Icon} className="h-3.5 w-3.5 shrink-0" />
            <span>Fecha: {observacion.fecha}</span>
          </div>
        </div>

        {/* Contenido de la observación */}
        <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-line">
          {observacion.observacion}
        </p>

        {/* Acciones de seguimiento */}
        {observacion.seguimiento && (
          <div className="bg-muted/40 text-muted-foreground border-border/50 space-y-1 rounded-md border p-3 text-xs">
            <div className="text-foreground/80 flex items-center gap-1.5 font-medium">
              <HugeiconsIcon icon={HelpCircleIcon} className="text-primary h-3.5 w-3.5" />
              Acciones de seguimiento tutorial:
            </div>
            <p className="pl-5 whitespace-pre-line">{observacion.seguimiento}</p>
          </div>
        )}

        {/* Pie de tarjeta */}
        <div className="border-border/60 text-muted-foreground flex items-center justify-between border-t pt-2 text-xs">
          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={UserIcon} className="h-3.5 w-3.5" />
            <span>Registrado por: {observacion.registradoPorNombre ?? "Tutor o psicólogo"}</span>
          </div>
          {observacion.esConfidencial && (
            <span className="text-muted-foreground/80 text-[11px] italic">
              Acceso restringido por confidencialidad
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
