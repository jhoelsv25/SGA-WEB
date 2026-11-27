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
  Clock01Icon,
  DocumentValidationIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import {
  DIMENSIONES_INDICADORES,
  INDICADORES_LISTA,
  MENSAJES_INDICADORES,
  NOMBRES_INDICADORES,
} from "../../consts";
import { useListarPretestsQuery } from "../../hooks/use-indicadores-queries";
import { usePuedeMedir } from "../../hooks/use-indicadores-permisos";
import { formatearPorcentaje } from "../../utils";
import type { Indicador, PretestResponseDto } from "../../types";
import { cn } from "@/lib/utils";

export interface ListaPretestsPanelProps {
  onRegistrarPretest: (indicador?: Indicador) => void;
  className?: string;
}

export function ListaPretestsPanel({ onRegistrarPretest, className }: ListaPretestsPanelProps) {
  const { data: pretests = [], isLoading, isError, error, refetch } = useListarPretestsQuery();
  const puedeMedir = usePuedeMedir();

  const formatearFechaLocal = (fechaStr?: string): string => {
    if (!fechaStr) return "—";
    try {
      return format(parseISO(fechaStr), "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
      return fechaStr;
    }
  };

  // Organizar pretests vigentes e históricos por indicador
  const pretestPorIndicador = React.useMemo(() => {
    const mapa: Record<
      Indicador,
      { vigente: PretestResponseDto | null; historicos: PretestResponseDto[] }
    > = {
      CSP: { vigente: null, historicos: [] },
      ISA: { vigente: null, historicos: [] },
      IGM: { vigente: null, historicos: [] },
    };

    for (const item of pretests) {
      if (item.vigente) {
        mapa[item.indicador].vigente = item;
      } else {
        mapa[item.indicador].historicos.push(item);
      }
    }

    return mapa;
  }, [pretests]);

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-full" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
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
        <p className="text-sm font-semibold">Error al cargar la lista de pretests</p>
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

  return (
    <div className={cn("space-y-5", className)}>
      {/* Cabecera del panel */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-foreground text-base font-semibold tracking-tight">
            Línea Base — Pretest Histórico
          </h3>
          <p className="text-muted-foreground text-xs">
            Medición de referencia previa a la intervención tecnológica para evaluar el impacto en
            la tesis.
          </p>
        </div>

        {puedeMedir ? (
          <Button
            onClick={() => onRegistrarPretest()}
            className="shadow-primary/20 h-9 gap-1.5 rounded-full px-4 text-xs font-semibold shadow-xs"
          >
            <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
            <span>Registrar pretest</span>
          </Button>
        ) : (
          <span className="text-muted-foreground text-xs italic">
            Solo Director o Administrador pueden registrar pretests.
          </span>
        )}
      </div>

      {/* Tarjetas de los 3 Indicadores */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {INDICADORES_LISTA.map((ind) => {
          const { vigente, historicos } = pretestPorIndicador[ind];
          const nombreCompleto = NOMBRES_INDICADORES[ind];
          const dimension = DIMENSIONES_INDICADORES[ind];

          return (
            <div
              key={ind}
              className="border-border/70 bg-card text-card-foreground flex flex-col justify-between rounded-2xl border p-4 shadow-2xs transition-shadow hover:shadow-xs"
            >
              <div>
                {/* Cabecera de la tarjeta */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                      {dimension}
                    </span>
                    <h4 className="text-foreground text-sm font-bold tracking-tight">
                      {ind} — {nombreCompleto}
                    </h4>
                  </div>
                  {vigente ? (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/40 bg-emerald-500/10 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300"
                    >
                      Vigente
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-amber-500/40 bg-amber-500/10 text-[10px] text-amber-700 dark:text-amber-300"
                    >
                      Sin pretest
                    </Badge>
                  )}
                </div>

                {/* Contenido con pretest o vacío */}
                {vigente ? (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-muted-foreground text-xs font-medium">
                        Porcentaje línea base:
                      </span>
                      <span className="text-foreground text-2xl font-black tracking-tight">
                        {formatearPorcentaje(vigente.porcentaje)}
                      </span>
                    </div>

                    <div className="border-border/50 bg-muted/40 space-y-1.5 rounded-xl border p-2.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Período:</span>
                        <span className="text-foreground font-semibold">
                          {vigente.periodoDescrito}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Conteo favorable / total:</span>
                        <span className="text-foreground font-semibold">
                          {vigente.numerador} / {vigente.denominador}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rango de fechas:</span>
                        <span className="text-foreground font-medium">
                          {vigente.fechaInicio} al {vigente.fechaFin}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="text-muted-foreground block text-[10px] font-medium tracking-wider uppercase">
                        Fuente documental:
                      </span>
                      <p className="bg-background text-foreground rounded-lg border border-dashed p-2 text-xs leading-relaxed italic">
                        «{vigente.fuente}»
                      </p>
                    </div>

                    <p className="text-muted-foreground text-[10px]">
                      Registrado el {formatearFechaLocal(vigente.creadoEn)}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center">
                    <HugeiconsIcon
                      icon={DocumentValidationIcon}
                      size={28}
                      className="text-muted-foreground/60 mb-2"
                    />
                    <p className="text-muted-foreground text-xs font-medium">
                      {MENSAJES_INDICADORES.SIN_PRETEST}
                    </p>
                    {puedeMedir && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRegistrarPretest(ind)}
                        className="mt-3 h-8 gap-1 rounded-full text-xs font-semibold"
                      >
                        <HugeiconsIcon icon={PlusSignIcon} className="size-3" />
                        <span>Registrar {ind}</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Pie con historial de versiones anteriores si existen */}
              {historicos.length > 0 && (
                <div className="border-border/60 mt-4 border-t pt-2.5">
                  <details className="group text-[11px]">
                    <summary className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center justify-between font-medium">
                      <span className="flex items-center gap-1">
                        <HugeiconsIcon icon={Clock01Icon} size={12} />
                        Historial previo ({historicos.length})
                      </span>
                      <span className="text-[10px] opacity-70 transition-transform group-open:rotate-180">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-2 space-y-1.5 pl-2">
                      {historicos.map((h) => (
                        <div
                          key={h.id}
                          className="text-muted-foreground flex items-center justify-between text-[10px]"
                        >
                          <span>{h.periodoDescrito}</span>
                          <span className="font-semibold">{formatearPorcentaje(h.porcentaje)}</span>
                          <span className="opacity-75">{h.fechaFin}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
