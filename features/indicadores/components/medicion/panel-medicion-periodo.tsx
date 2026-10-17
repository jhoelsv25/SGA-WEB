"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  Archive02Icon,
  Clock01Icon,
  InformationCircleIcon,
  LockKeyIcon,
  RepeatIcon,
} from "@hugeicons/core-free-icons";
import { MENSAJES_INDICADORES, NOMBRES_INDICADORES } from "../../consts";
import { useMedicionPeriodoQuery } from "../../hooks/use-indicadores-queries";
import { usePuedeMedir } from "../../hooks/use-indicadores-permisos";
import { formatearPorcentaje } from "../../utils";
import { GraficoBarrasSvg, type ItemBarraSvg } from "./grafico-barras-svg";
import type { DesgloseCspDto, DesgloseIgmDto, DesgloseIsaDto } from "../../types";
import { cn } from "@/lib/utils";

export interface PanelMedicionPeriodoProps {
  periodo: {
    id: string;
    nombre: string;
    estado: string; // "cerrado", "en_curso", "planificado"
    numero?: number;
  };
  onCerrarMedicion: () => void;
  onNuevaVersion: (medicion: { id: string; periodoNombre: string; versionActual: number }) => void;
  onVerHistorial?: () => void;
  className?: string;
}

export function PanelMedicionPeriodo({
  periodo,
  onCerrarMedicion,
  onNuevaVersion,
  onVerHistorial,
  className,
}: PanelMedicionPeriodoProps) {
  const {
    data: medicion,
    isLoading,
    isError,
    error,
    refetch,
  } = useMedicionPeriodoQuery(periodo.id, Boolean(periodo.id));
  const puedeMedir = usePuedeMedir();

  const esBimestreCerrado = periodo.estado === "cerrado";

  const formatearFechaHora = (fechaIso?: string): string => {
    if (!fechaIso) return "—";
    try {
      return format(parseISO(fechaIso), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
    } catch {
      return fechaIso;
    }
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={cn(
          "border-destructive/30 bg-destructive/10 text-destructive rounded-2xl border p-6 text-center",
          className,
        )}
      >
        <HugeiconsIcon icon={AlertCircleIcon} size={32} className="mx-auto mb-2" />
        <p className="text-sm font-semibold">Error al consultar la medición del período</p>
        <p className="text-muted-foreground mt-1 text-xs">
          {error?.message || "Inténtalo nuevamente."}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          className="mt-4 rounded-full"
        >
          Reintentar
        </Button>
      </div>
    );
  }

  // CASO 1: No existe aún medición cerrada para este período
  if (!medicion) {
    return (
      <div className={cn("space-y-5", className)}>
        <div className="border-border/70 bg-card text-card-foreground flex flex-col justify-between rounded-2xl border p-5 shadow-2xs">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-foreground text-base font-bold tracking-tight">
                  Estado de medición: {periodo.nombre}
                </span>
                {esBimestreCerrado ? (
                  <Badge
                    variant="outline"
                    className="border-amber-500/40 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-300"
                  >
                    Pendiente de cierre de medición
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-primary/40 bg-primary/10 text-primary text-xs"
                  >
                    Período {periodo.estado}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground max-w-2xl text-xs leading-relaxed">
                {esBimestreCerrado
                  ? "Este bimestre se encuentra cerrado en el calendario académico. Al cerrar la medición, el sistema calculará y congelará de forma definitiva los tres indicadores (CSP, ISA, IGM) como postest oficial inmutable."
                  : `El bimestre está ${periodo.estado}. ${MENSAJES_INDICADORES.BIMESTRE_ABIERTO}`}
              </p>
            </div>

            {puedeMedir && esBimestreCerrado && (
              <Button
                onClick={onCerrarMedicion}
                className="shadow-primary/20 h-10 shrink-0 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
              >
                <HugeiconsIcon icon={Archive02Icon} className="size-3.5" />
                <span>Cerrar medición</span>
              </Button>
            )}
          </div>

          {!puedeMedir && (
            <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs italic">
              <HugeiconsIcon icon={InformationCircleIcon} size={16} />
              <span>{MENSAJES_INDICADORES.ROL_NO_AUTORIZADO}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // CASO 2: Medición vigente congelada existente
  const itemsGrafico: ItemBarraSvg[] = medicion.indicadores.map((ind) => ({
    etiqueta: ind.indicador,
    subtitulo: NOMBRES_INDICADORES[ind.indicador],
    valor: ind.porcentaje,
    valorTexto: `${ind.porcentaje.toFixed(2)} %`,
  }));

  return (
    <div className={cn("space-y-5", className)}>
      {/* Banner de estado de la medición vigente */}
      <div className="border-border/70 bg-card text-card-foreground rounded-2xl border p-5 shadow-2xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-foreground text-base font-bold tracking-tight">
                Medición congelada — {periodo.nombre}
              </span>
              <Badge className="gap-1 border-emerald-500/40 bg-emerald-500/10 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <HugeiconsIcon icon={LockKeyIcon} size={12} />
                <span>Versión {medicion.version} (Vigente)</span>
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              Valores postest oficiales congelados de forma inmutable para la tesis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onVerHistorial && (
              <Button
                variant="outline"
                size="sm"
                onClick={onVerHistorial}
                className="h-9 gap-1.5 rounded-full text-xs font-medium"
              >
                <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
                <span>Historial de versiones</span>
              </Button>
            )}

            {puedeMedir && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onNuevaVersion({
                    id: medicion.id,
                    periodoNombre: periodo.nombre,
                    versionActual: medicion.version,
                  })
                }
                className="h-9 gap-1.5 rounded-full text-xs font-semibold"
              >
                <HugeiconsIcon icon={RepeatIcon} className="size-3.5" />
                <span>Nueva versión con motivo</span>
              </Button>
            )}
          </div>
        </div>

        {/* Metadatos de auditoría y motivo */}
        <div className="border-border/60 text-muted-foreground mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span>Congelada: {formatearFechaHora(medicion.cerradaEn)}</span>
            {medicion.cerradaPorNombre && <span>Por: {medicion.cerradaPorNombre}</span>}
          </div>
          {medicion.motivoCambio && (
            <div className="text-foreground italic">Motivo: «{medicion.motivoCambio}»</div>
          )}
        </div>
      </div>

      {/* Gráfico de barras SVG de los 3 indicadores de la medición */}
      <GraficoBarrasSvg
        titulo={`Postest oficial — ${periodo.nombre} (Versión ${medicion.version})`}
        descripcion="Porcentaje alcanzado por dimensión académica con la implementación del SGA."
        items={itemsGrafico}
        altura={240}
      />

      {/* Tarjetas de detalle de los 3 indicadores congelados */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {medicion.indicadores.map((ind) => {
          const nombre = NOMBRES_INDICADORES[ind.indicador];
          const desglose = ind.desglose;

          return (
            <div
              key={ind.indicador}
              className="border-border/70 bg-card text-card-foreground flex flex-col justify-between rounded-2xl border p-4 shadow-2xs"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-foreground text-sm font-bold">
                    {ind.indicador} — {nombre}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-primary/20 bg-primary/5 text-primary text-[10px]"
                  >
                    Postest v{medicion.version}
                  </Badge>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-muted-foreground text-xs font-medium">
                    Porcentaje postest:
                  </span>
                  <span className="text-foreground text-2xl font-black tracking-tight">
                    {formatearPorcentaje(ind.porcentaje)}
                  </span>
                </div>

                <div className="border-border/50 bg-muted/40 space-y-1 rounded-xl border p-2.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Numerador / Denominador:</span>
                    <span className="text-foreground font-semibold">
                      {ind.numerador} / {ind.denominador}
                    </span>
                  </div>

                  {ind.indicador === "CSP" && Boolean(desglose) && (
                    <>
                      <div className="text-muted-foreground flex justify-between">
                        <span>Cumplidas + Parciales:</span>
                        <span className="text-foreground font-medium">
                          {(desglose as DesgloseCspDto).cumplidas ?? 0} +{" "}
                          {(desglose as DesgloseCspDto).parciales ?? 0}
                        </span>
                      </div>
                      <div className="text-muted-foreground flex justify-between">
                        <span>No cumplidas / Justificadas:</span>
                        <span className="text-foreground font-medium">
                          {(desglose as DesgloseCspDto).noCumplidas ?? 0} /{" "}
                          {(desglose as DesgloseCspDto).justificadas ?? 0}
                        </span>
                      </div>
                    </>
                  )}

                  {ind.indicador === "ISA" && Boolean(desglose) && (
                    <>
                      <div className="text-muted-foreground flex justify-between">
                        <span>Publicadas a tiempo:</span>
                        <span className="text-foreground font-medium">
                          {(desglose as DesgloseIsaDto).publicadasATiempo ?? 0}
                        </span>
                      </div>
                      <div className="text-muted-foreground flex justify-between">
                        <span>Vistas por familia:</span>
                        <span className="text-foreground font-medium">
                          {(desglose as DesgloseIsaDto).vistasPorFamilia ?? 0} (
                          {formatearPorcentaje(
                            (desglose as DesgloseIsaDto).porcentajeVistasFamilia,
                          )}
                          )
                        </span>
                      </div>
                    </>
                  )}

                  {ind.indicador === "IGM" && Boolean(desglose) && (
                    <>
                      <div className="text-muted-foreground flex justify-between">
                        <span>A tiempo / Fuera de plazo:</span>
                        <span className="text-foreground font-medium">
                          {(desglose as DesgloseIgmDto).publicadosATiempo ?? 0} /{" "}
                          {(desglose as DesgloseIgmDto).publicadosFueraDePlazo ?? 0}
                        </span>
                      </div>
                      <div className="text-muted-foreground flex justify-between">
                        <span>Materiales extra (no cuentan):</span>
                        <span className="text-foreground font-medium">
                          {(desglose as DesgloseIgmDto).extras ?? 0}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
