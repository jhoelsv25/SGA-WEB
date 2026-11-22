"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrabajoReporteItem } from "../types";

function formatearTamano(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatearHora(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

interface ReportesColaPanelProps {
  trabajos: TrabajoReporteItem[];
  descargandoKey: string | null;
  descargadosIds: string[];
  eliminandoId: string | null;
  limpiandoTrabajos: boolean;
  onDescargarTrabajo: (trabajo: TrabajoReporteItem) => void;
  onEliminarTrabajo: (jobId: string) => void;
  onLimpiarTrabajos: () => void;
}

export function ReportesColaPanel({
  trabajos,
  descargandoKey,
  descargadosIds,
  eliminandoId,
  limpiandoTrabajos,
  onDescargarTrabajo,
  onEliminarTrabajo,
  onLimpiarTrabajos,
}: ReportesColaPanelProps) {
  if (trabajos.length === 0) return null;

  const activos = trabajos.filter(
    (t) => t.estado === "encolado" || t.estado === "procesando",
  ).length;
  const finalizados = trabajos.length - activos;

  return (
    <Card className="border-primary/25 bg-card">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <HugeiconsIcon icon={Clock01Icon} className="text-primary size-4" />
          <CardTitle className="text-sm">Descargas recientes</CardTitle>
          <span className="text-muted-foreground hidden text-[11px] sm:inline">
            · Disponibles por 2 horas
          </span>
        </div>
        <div className="flex items-center gap-2">
          {activos > 0 ? (
            <StatusBadge tone="info" dot>
              {activos} en proceso
            </StatusBadge>
          ) : (
            <StatusBadge tone="success">{trabajos.length} recientes</StatusBadge>
          )}
          {finalizados > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={limpiandoTrabajos}
              onClick={onLimpiarTrabajos}
              className="text-muted-foreground hover:text-foreground h-7 rounded-full px-2.5 text-xs"
            >
              {limpiandoTrabajos ? "Limpiando..." : "Limpiar"}
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5">
        {trabajos.slice(0, 6).map((trabajo) => {
          const enProceso = trabajo.estado === "encolado" || trabajo.estado === "procesando";
          const sinRegistros = trabajo.estado === "completado" && trabajo.totalFilas === 0;
          const listo =
            trabajo.estado === "completado" && !sinRegistros && trabajo.disponibleDescarga;
          const fallido = trabajo.estado === "fallido";
          const bajando = descargandoKey === `job-${trabajo.jobId}`;
          const yaDescargado = descargadosIds.includes(trabajo.jobId);
          const quitando = eliminandoId === trabajo.jobId;

          return (
            <div
              key={trabajo.jobId}
              className="border-border/60 bg-muted/20 flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-xs font-semibold">{trabajo.etiqueta}</span>
                  <span className="text-muted-foreground text-[11px]">
                    {formatearHora(trabajo.creadoEn)}
                  </span>
                  {trabajo.totalFilas && trabajo.totalFilas > 0 ? (
                    <span className="text-muted-foreground text-[11px]">
                      · {trabajo.totalFilas} registros
                    </span>
                  ) : null}
                  {trabajo.tamanoBytes ? (
                    <span className="text-muted-foreground text-[11px]">
                      · {formatearTamano(trabajo.tamanoBytes)}
                    </span>
                  ) : null}
                </div>

                {enProceso ? (
                  <div className="space-y-1">
                    <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(10, trabajo.progreso)}%` }}
                      />
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      {trabajo.mensajeEstado} ({trabajo.progreso}%)
                    </p>
                  </div>
                ) : fallido ? (
                  <p className="text-destructive flex items-center gap-1 text-[11px]">
                    <HugeiconsIcon icon={AlertCircleIcon} className="size-3.5 shrink-0" />
                    <span className="truncate">{trabajo.error || trabajo.mensajeEstado}</span>
                  </p>
                ) : sinRegistros ? (
                  <p className="flex items-center gap-1 text-[11px] text-amber-500">
                    <HugeiconsIcon icon={AlertCircleIcon} className="size-3.5 shrink-0" />
                    <span className="truncate">{trabajo.mensajeEstado}</span>
                  </p>
                ) : (
                  <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      className="size-3.5 shrink-0 text-emerald-500"
                    />
                    <span className="truncate">
                      {trabajo.nombreArchivo || trabajo.mensajeEstado}
                    </span>
                    {yaDescargado ? <span className="text-emerald-500">· Descargado</span> : null}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                {listo ? (
                  <Button
                    type="button"
                    size="sm"
                    variant={yaDescargado ? "outline" : "default"}
                    disabled={descargandoKey !== null || quitando}
                    onClick={() => onDescargarTrabajo(trabajo)}
                    className="h-8 gap-1.5 rounded-full px-3.5 text-xs"
                  >
                    <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
                    {bajando ? "Bajando..." : yaDescargado ? "Descargar de nuevo" : "Descargar"}
                  </Button>
                ) : enProceso ? (
                  <StatusBadge tone="info" dot>
                    {trabajo.progreso}%
                  </StatusBadge>
                ) : sinRegistros ? (
                  <StatusBadge tone="warning">Sin registros</StatusBadge>
                ) : fallido ? (
                  <StatusBadge tone="danger">Error</StatusBadge>
                ) : (
                  <StatusBadge tone="neutral">Expirado</StatusBadge>
                )}

                {!enProceso ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={quitando || limpiandoTrabajos}
                    onClick={() => onEliminarTrabajo(trabajo.jobId)}
                    title="Quitar de descargas recientes"
                    aria-label={`Quitar ${trabajo.etiqueta}`}
                    className="text-muted-foreground hover:text-foreground size-8 rounded-full"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
