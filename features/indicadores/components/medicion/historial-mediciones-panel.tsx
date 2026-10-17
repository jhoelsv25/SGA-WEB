"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  Archive02Icon,
  Clock01Icon,
  RepeatIcon,
} from "@hugeicons/core-free-icons";
import { NOMBRES_INDICADORES } from "../../consts";
import { useHistorialMedicionesQuery } from "../../hooks/use-indicadores-queries";
import { usePuedeMedir } from "../../hooks/use-indicadores-permisos";
import { formatearPorcentaje } from "../../utils";
import { GraficoBarrasSvg, type ItemBarraSvg } from "./grafico-barras-svg";
import type {
  DesgloseCspDto,
  DesgloseIgmDto,
  DesgloseIsaDto,
  MedicionBimestreResponseDto,
} from "../../types";
import { cn } from "@/lib/utils";

export interface HistorialMedicionesPanelProps {
  periodoId: string;
  periodoNombre: string;
  onNuevaVersion?: (medicion: { id: string; periodoNombre: string; versionActual: number }) => void;
  className?: string;
}

export function HistorialMedicionesPanel({
  periodoId,
  periodoNombre,
  onNuevaVersion,
  className,
}: HistorialMedicionesPanelProps) {
  const {
    data: historial,
    isLoading,
    isError,
    error,
    refetch,
  } = useHistorialMedicionesQuery(periodoId, Boolean(periodoId));
  const puedeMedir = usePuedeMedir();

  const versiones = historial?.versiones ?? [];
  const versionVigente = versiones.find((v) => v.vigente) ?? versiones[0];
  const [versionSeleccionadaId, setVersionSeleccionadaId] = React.useState<string | null>(null);

  // Derivar versión activa sin necesidad de efectos secundarios
  const versionActivaId = versionSeleccionadaId ?? versionVigente?.id;
  const versionActiva: MedicionBimestreResponseDto | undefined =
    versiones.find((v) => v.id === versionActivaId) ?? versionVigente;

  const formatearFechaHora = (fechaIso?: string): string => {
    if (!fechaIso) return "—";
    try {
      return format(parseISO(fechaIso), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
    } catch {
      return fechaIso;
    }
  };

  if (!periodoId) {
    return (
      <EmptyState
        title="Selecciona un período académico"
        description="Elige un bimestre para consultar su historial de mediciones congeladas."
        icon={Clock01Icon}
        className={className}
      />
    );
  }

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <Skeleton className="h-8 w-64 rounded-lg" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
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
        <p className="text-sm font-semibold">Error al cargar el historial de mediciones</p>
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

  if (versiones.length === 0) {
    return (
      <EmptyState
        title={`Sin mediciones cerradas en ${periodoNombre}`}
        description="Este bimestre no cuenta todavía con una medición congelada. Al cerrar el bimestre podrás registrar la medición oficial."
        icon={Archive02Icon}
        className={className}
      />
    );
  }

  // Preparar datos para el gráfico de barras SVG de la versión inspeccionada
  const itemsGrafico: ItemBarraSvg[] = (versionActiva?.indicadores ?? []).map((item) => ({
    etiqueta: item.indicador,
    subtitulo: NOMBRES_INDICADORES[item.indicador],
    valor: item.porcentaje,
    valorTexto: `${item.porcentaje.toFixed(2)} %`,
  }));

  return (
    <div className={cn("space-y-6", className)}>
      {/* Cabecera del historial con selector de versión */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-foreground text-base font-semibold tracking-tight">
              Historial de Mediciones — {periodoNombre}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {versiones.length} {versiones.length === 1 ? "versión" : "versiones"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs">
            Registro de versiones congeladas inmutables para garantizar rigor científico en la
            tesis.
          </p>
        </div>

        {puedeMedir && versionVigente && onNuevaVersion && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onNuevaVersion({
                id: versionVigente.id,
                periodoNombre,
                versionActual: versionVigente.version,
              })
            }
            className="h-9 gap-1.5 rounded-full text-xs font-semibold"
          >
            <HugeiconsIcon icon={RepeatIcon} className="size-3.5" />
            <span>Nueva versión con motivo</span>
          </Button>
        )}
      </div>

      {/* Selector de versiones (pills horizontales) */}
      <div className="flex flex-wrap items-center gap-2">
        {versiones.map((v) => {
          const seleccionada = v.id === versionActiva?.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setVersionSeleccionadaId(v.id)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                seleccionada
                  ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "border-border/80 bg-card hover:bg-muted/60 text-foreground",
              )}
            >
              <span>Versión {v.version}</span>
              {v.vigente ? (
                <span
                  className={cn(
                    "py-0.2 rounded-full px-1.5 text-[9px] font-bold uppercase",
                    seleccionada
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
                  )}
                >
                  Vigente
                </span>
              ) : (
                <span className="text-muted-foreground text-[9px]">Histórica (v0)</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Detalle de la versión activa seleccionada */}
      {versionActiva && (
        <div className="space-y-5">
          {/* Tarjeta de metadatos de la versión */}
          <div className="border-border/70 bg-card text-card-foreground rounded-2xl border p-4 shadow-2xs">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-foreground text-sm font-bold">
                  Versión {versionActiva.version}
                </span>
                {versionActiva.vigente ? (
                  <Badge className="border-emerald-500/40 bg-emerald-500/10 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    Versión Vigente
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-muted text-muted-foreground text-xs">
                    Vigencia 0 (Inactiva por nueva versión)
                  </Badge>
                )}
              </div>

              <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
                <span>Cerrada: {formatearFechaHora(versionActiva.cerradaEn)}</span>
                {versionActiva.cerradaPorNombre && (
                  <span>Por: {versionActiva.cerradaPorNombre}</span>
                )}
              </div>
            </div>

            {/* Motivo de cambio si versión >= 2 */}
            {versionActiva.motivoCambio && (
              <div className="border-primary/20 bg-primary/5 mt-3 rounded-xl border p-3 text-xs leading-relaxed">
                <span className="text-primary font-semibold">Motivo justificado del cambio: </span>
                <span className="text-foreground italic">«{versionActiva.motivoCambio}»</span>
              </div>
            )}
          </div>

          {/* Gráfico de barras SVG de los 3 indicadores de la versión */}
          <GraficoBarrasSvg
            titulo={`Indicadores congelados — Versión ${versionActiva.version}`}
            descripcion={`Valores inmutables de CSP, ISA e IGM correspondientes a la medición del ${periodoNombre}.`}
            items={itemsGrafico}
            altura={240}
          />

          {/* Tarjetas desglosadas de los 3 indicadores congelados */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {versionActiva.indicadores.map((ind) => {
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
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-muted-foreground text-xs font-medium">
                        Porcentaje congelado:
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

                      {/* Desglose específico por indicador */}
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
                            <span>No cumplidas:</span>
                            <span className="text-foreground font-medium">
                              {(desglose as DesgloseCspDto).noCumplidas ?? 0}
                            </span>
                          </div>
                          <div className="text-muted-foreground flex justify-between">
                            <span>Justificadas (excluidas):</span>
                            <span className="text-foreground font-medium">
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
                            <span>Fuera de plazo / Pendientes:</span>
                            <span className="text-foreground font-medium">
                              {(desglose as DesgloseIsaDto).publicadasFueraDePlazo ?? 0} /{" "}
                              {(desglose as DesgloseIsaDto).pendientes ?? 0}
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
                            <span>Pendientes:</span>
                            <span className="text-foreground font-medium">
                              {(desglose as DesgloseIgmDto).pendientes ?? 0}
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
      )}
    </div>
  );
}
