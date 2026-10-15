"use client";

import * as React from "react";
import {
  CheckmarkCircle02Icon,
  Clock01Icon,
  HelpCircleIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export interface ConsolidadosMetricasProps {
  totalDocentes: number;
  promedioCumplimiento: number;
  totalMinutosFuera: number;
  solicitudesPendientesTotal: number;
}

export function ConsolidadosMetricas({
  totalDocentes,
  promedioCumplimiento,
  totalMinutosFuera,
  solicitudesPendientesTotal,
}: ConsolidadosMetricasProps) {
  const horasFuera = Math.floor(totalMinutosFuera / 60);
  const minFueraRest = totalMinutosFuera % 60;
  const textoFuera = `${horasFuera}h ${minFueraRest}m`;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total docentes */}
      <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-medium">
            Docentes con Consolidado
          </span>
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-xl">
            <HugeiconsIcon icon={UserGroupIcon} className="size-4" />
          </div>
        </div>
        <p className="text-foreground mt-2 font-mono text-2xl font-bold">{totalDocentes}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">Padrón de docentes activos</p>
      </div>

      {/* Promedio cumplimiento */}
      <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-medium">Cumplimiento Promedio</span>
          <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
          </div>
        </div>
        <p className="text-foreground mt-2 font-mono text-2xl font-bold">{promedioCumplimiento}%</p>
        <p className="text-muted-foreground mt-0.5 text-xs">Sesiones dictadas o justificadas</p>
      </div>

      {/* Tiempo fuera */}
      <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-medium">Tiempo Fuera de Aula</span>
          <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <HugeiconsIcon icon={Clock01Icon} className="size-4" />
          </div>
        </div>
        <p className="text-foreground mt-2 font-mono text-2xl font-bold">{textoFuera}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">Ausencias e ingresos tardíos</p>
      </div>

      {/* Solicitudes pendientes */}
      <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-medium">Revisiones Pendientes</span>
          <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <HugeiconsIcon icon={HelpCircleIcon} className="size-4" />
          </div>
        </div>
        <p className="text-foreground mt-2 font-mono text-2xl font-bold">
          {solicitudesPendientesTotal}
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs">Solicitudes docentes por resolver</p>
      </div>
    </div>
  );
}
