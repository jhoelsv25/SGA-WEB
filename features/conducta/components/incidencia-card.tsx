"use client";

import * as React from "react";
import {
  Award01Icon,
  AlertCircleIcon,
  Edit02Icon,
  Delete02Icon,
  CheckmarkCircle02Icon,
  Calendar03Icon,
  Location01Icon,
  UserIcon,
  ChartLineData02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GRAVEDAD_CONFIG } from "../constants";
import type { IncidenciaItem } from "../types";

interface IncidenciaCardProps {
  incidencia: IncidenciaItem;
  currentUserId?: string;
  onEditar?: (incidencia: IncidenciaItem) => void;
  onAnular?: (incidencia: IncidenciaItem) => void;
  onVerResumen?: (matriculaId: string) => void;
}

export function IncidenciaCard({
  incidencia,
  currentUserId,
  onEditar,
  onAnular,
  onVerResumen,
}: IncidenciaCardProps) {
  // Instante de render para verificar ventana de 24 horas
  const [currentTimestamp] = React.useState(() => Date.now());

  // Verificar si está dentro de la ventana de 24 horas para corrección
  const editable = React.useMemo(() => {
    const creada = new Date(incidencia.creadoEn).getTime();
    const horasTranscurridas = (currentTimestamp - creada) / (1000 * 60 * 60);
    const esAutor = currentUserId ? incidencia.registradoPorId === currentUserId : true;
    return horasTranscurridas <= 24 && esAutor;
  }, [incidencia.creadoEn, incidencia.registradoPorId, currentUserId, currentTimestamp]);

  const esMerito = incidencia.tipo === "merito";
  const gravedadConfig =
    incidencia.gravedad && GRAVEDAD_CONFIG[incidencia.gravedad]
      ? GRAVEDAD_CONFIG[incidencia.gravedad]
      : null;

  return (
    <Card className="border-border/80 hover:border-primary/40 overflow-hidden border transition-all hover:shadow-xs">
      <CardContent className="space-y-4 p-5">
        {/* Encabezado */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              {esMerito ? (
                <Badge
                  variant="outline"
                  className="border-emerald-300 bg-emerald-500/10 text-[11px] font-medium text-emerald-700 dark:border-emerald-800 dark:text-emerald-400"
                >
                  <HugeiconsIcon icon={Award01Icon} className="mr-1 h-3.5 w-3.5" />
                  Mérito (+)
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className={cn("text-[11px] font-medium", gravedadConfig?.badgeClass)}
                >
                  <HugeiconsIcon icon={AlertCircleIcon} className="mr-1 h-3.5 w-3.5" />
                  {gravedadConfig?.label ?? "Falta (−)"}
                </Badge>
              )}

              <Badge variant="secondary" className="text-[11px] font-medium">
                {incidencia.categoria}
              </Badge>

              {incidencia.periodoNombre && (
                <Badge variant="outline" className="text-muted-foreground text-[11px]">
                  {incidencia.periodoNombre}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-2 pt-0.5">
              <span className="text-foreground text-base font-semibold">
                {incidencia.estudianteNombre ?? "Estudiante"}
              </span>
              {incidencia.codigoEstudiante && (
                <span className="text-muted-foreground font-mono text-xs">
                  ({incidencia.codigoEstudiante})
                </span>
              )}
              {incidencia.seccionNombre && (
                <span className="text-muted-foreground text-xs font-medium">
                  • Sección: {incidencia.seccionNombre}
                </span>
              )}
            </div>
          </div>

          <div className="text-muted-foreground flex items-center gap-1.5 text-xs sm:text-right">
            <HugeiconsIcon icon={Calendar03Icon} className="h-3.5 w-3.5 shrink-0" />
            <span>Fecha: {incidencia.fecha}</span>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-line">
          {incidencia.descripcion}
        </p>

        {/* Detalles adicionales: lugar y medidas */}
        {(incidencia.lugar || incidencia.medidasTomadas) && (
          <div className="bg-muted/40 text-muted-foreground border-border/50 space-y-1.5 rounded-md border p-3 text-xs">
            {incidencia.lugar && (
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon
                  icon={Location01Icon}
                  className="text-foreground/70 h-3.5 w-3.5 shrink-0"
                />
                <span>
                  <strong className="text-foreground/80 font-medium">Lugar:</strong>{" "}
                  {incidencia.lugar}
                </span>
              </div>
            )}
            {incidencia.medidasTomadas && (
              <div>
                <strong className="text-foreground/80 font-medium">
                  Medidas formativas adoptadas:
                </strong>{" "}
                {incidencia.medidasTomadas}
              </div>
            )}
          </div>
        )}

        {/* Pie de tarjeta: Registrador, notificación al apoderado y acciones */}
        <div className="border-border/60 text-muted-foreground flex flex-col gap-3 border-t pt-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <HugeiconsIcon icon={UserIcon} className="h-3.5 w-3.5" />
              <span>Registrado por: {incidencia.registradoPorNombre ?? "Personal docente"}</span>
            </div>

            {incidencia.apoderadoNotificado && (
              <div className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-3.5 w-3.5" />
                <span>Apoderado notificado</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-auto">
            {onVerResumen && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 px-2.5 text-xs"
                onClick={() => onVerResumen(incidencia.matriculaId)}
              >
                <HugeiconsIcon icon={ChartLineData02Icon} className="h-3.5 w-3.5" />
                Ficha Resumen
              </Button>
            )}

            {editable && onEditar && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2.5 text-xs"
                onClick={() => onEditar(incidencia)}
              >
                <HugeiconsIcon icon={Edit02Icon} className="h-3.5 w-3.5" />
                Corregir (&lt;24h)
              </Button>
            )}

            {onAnular && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 gap-1 px-2.5 text-xs"
                onClick={() => onAnular(incidencia)}
              >
                <HugeiconsIcon icon={Delete02Icon} className="h-3.5 w-3.5" />
                Anular
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
