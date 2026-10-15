"use client";

import * as React from "react";
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Time02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { ConsolidadoResumenDto } from "../../types";

interface MiSeguimientoTotalesProps {
  consolidado: ConsolidadoResumenDto;
}

function MetricaCard({
  etiqueta,
  valor,
  subtitulo,
  icono,
  destacado = false,
}: {
  etiqueta: string;
  valor: string | number;
  subtitulo: string;
  icono: IconSvgElement;
  destacado?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-2xs transition-all ${
        destacado
          ? "border-primary/40 bg-primary/5 ring-primary/20 ring-1"
          : "border-border/60 bg-card"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-muted-foreground text-xs font-medium">{etiqueta}</p>
        <div
          className={`flex size-7 items-center justify-center rounded-lg ${
            destacado ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <HugeiconsIcon icon={icono} className="size-4" />
        </div>
      </div>
      <p
        className={`mt-2 text-2xl font-extrabold tracking-tight tabular-nums ${
          destacado ? "text-primary" : "text-foreground"
        }`}
      >
        {valor}
      </p>
      <p className="text-2xs text-muted-foreground mt-1">{subtitulo}</p>
    </div>
  );
}

/**
 * Indicadores cuantitativos resumidos del consolidado docente (HU1, HU3).
 * Muestra el total de tiempo fuera de clase (formato 'X h Y min'), minutos perdidos
 * por firma, ausencias vigentes y desglose de sesiones por estado.
 */
export function MiSeguimientoTotales({ consolidado }: MiSeguimientoTotalesProps) {
  const porcentajeCumplidas =
    consolidado.sesionesProgramadas > 0
      ? Math.round((consolidado.sesionesCumplidas / consolidado.sesionesProgramadas) * 100)
      : 0;

  return (
    <div className="space-y-4">
      {/* 4 Métricas clave */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricaCard
          etiqueta="Total fuera de clase"
          valor={consolidado.tiempoFueraClaseTexto}
          subtitulo="Firma + tiempo fuera del aula"
          icono={Clock01Icon}
          destacado={true}
        />
        <MetricaCard
          etiqueta="Minutos por firma"
          valor={`${consolidado.minutosPerdidosFirma} min`}
          subtitulo="Retrasos y salidas anticipadas"
          icono={Time02Icon}
        />
        <MetricaCard
          etiqueta="Tiempo fuera del aula"
          valor={`${consolidado.minutosFueraAula} min`}
          subtitulo={`${consolidado.totalAusencias} ${
            consolidado.totalAusencias === 1 ? "ausencia vigente" : "ausencias vigentes"
          }`}
          icono={AlertCircleIcon}
        />
        <MetricaCard
          etiqueta="Sesiones cumplidas"
          valor={`${consolidado.sesionesCumplidas} / ${consolidado.sesionesProgramadas}`}
          subtitulo={`${porcentajeCumplidas}% de cumplimiento`}
          icono={CheckmarkCircle02Icon}
        />
      </div>

      {/* Desglose de sesiones por estado */}
      <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-2xs">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Estado de las sesiones en el bimestre ({consolidado.sesionesProgramadas} programadas)
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="border-border/40 bg-muted/15 flex items-center justify-between rounded-xl border p-2.5">
            <span className="text-muted-foreground text-xs font-medium">Cumplidas</span>
            <span className="text-foreground text-sm font-bold tabular-nums">
              {consolidado.sesionesCumplidas}
            </span>
          </div>

          <div className="border-border/40 bg-muted/15 flex items-center justify-between rounded-xl border p-2.5">
            <span className="text-muted-foreground text-xs font-medium">Parciales</span>
            <span className="text-foreground text-sm font-bold tabular-nums">
              {consolidado.sesionesParciales}
            </span>
          </div>

          <div className="border-border/40 bg-muted/15 flex items-center justify-between rounded-xl border p-2.5">
            <span className="text-muted-foreground text-xs font-medium">No cumplidas</span>
            <span className="text-destructive text-sm font-bold tabular-nums">
              {consolidado.sesionesNoCumplidas}
            </span>
          </div>

          <div className="border-border/40 bg-muted/15 flex items-center justify-between rounded-xl border p-2.5">
            <span className="text-muted-foreground text-xs font-medium">Justificadas</span>
            <span className="text-foreground text-sm font-bold tabular-nums">
              {consolidado.sesionesJustificadas}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
