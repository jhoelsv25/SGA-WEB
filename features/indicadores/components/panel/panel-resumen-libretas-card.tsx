"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, Book02Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import type { ResumenLibretasPendientesDto } from "../../types";

export interface PanelResumenLibretasCardProps {
  libretas: ResumenLibretasPendientesDto;
  className?: string;
}

/**
 * Tarjeta de libretas de calificaciones pendientes del bimestre para el panel directivo.
 */
export function PanelResumenLibretasCard({
  libretas,
  className = "",
}: PanelResumenLibretasCardProps) {
  const tieneVencidas = libretas.vencidas > 0;

  return (
    <div
      className={`border-border/60 bg-card flex flex-col justify-between rounded-2xl border p-5 shadow-xs ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span
              className={`flex size-10 items-center justify-center rounded-xl ${
                tieneVencidas
                  ? "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                  : "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
              }`}
              aria-hidden="true"
            >
              <HugeiconsIcon
                icon={tieneVencidas ? AlertCircleIcon : Book02Icon}
                size={22}
                strokeWidth={2}
              />
            </span>
            <div>
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Seguimiento académico
              </span>
              <h3 className="text-foreground text-base font-semibold">Libretas pendientes</h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-foreground text-2xl font-extrabold sm:text-3xl">
              {libretas.totalPendientes}
            </span>
            <span className="text-muted-foreground block text-[11px]">por publicar</span>
          </div>
        </div>

        {/* Métrica de vencidas vs por vencer */}
        <div className="mt-5 grid grid-cols-2 gap-3 border-b pb-4">
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 dark:bg-rose-500/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                Vencidas
              </span>
              {tieneVencidas && (
                <Badge variant="destructive" className="px-1.5 py-0 text-[10px]">
                  Crítico
                </Badge>
              )}
            </div>
            <div className="mt-1 text-2xl font-bold text-rose-800 dark:text-rose-300">
              {libretas.vencidas}
            </div>
            <p className="text-muted-foreground mt-0.5 text-[10px]">Fecha límite anterior a hoy</p>
          </div>

          <div className="bg-muted/40 rounded-xl border p-3">
            <span className="text-muted-foreground block text-xs font-semibold">Por vencer</span>
            <div className="text-foreground mt-1 text-2xl font-bold">{libretas.porVencer}</div>
            <p className="text-muted-foreground mt-0.5 text-[10px]">Dentro del plazo previsto</p>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mt-4 text-[11px]">
        {tieneVencidas
          ? "Las libretas vencidas impactan negativamente en el numerador del ISA al momento de la publicación."
          : "Todas las libretas pendientes se encuentran dentro del cronograma previsto."}
      </p>
    </div>
  );
}
