"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Book01Icon } from "@hugeicons/core-free-icons";
import type { ResumenSesionesHoyDto } from "../../types";

export interface PanelResumenSesionesCardProps {
  sesiones: ResumenSesionesHoyDto;
  className?: string;
}

/**
 * Tarjeta resumen de sesiones de clase del día en el panel directivo.
 */
export function PanelResumenSesionesCard({
  sesiones,
  className = "",
}: PanelResumenSesionesCardProps) {
  return (
    <div
      className={`border-border/60 bg-card flex flex-col justify-between rounded-2xl border p-5 shadow-xs ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span
              className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
              aria-hidden="true"
            >
              <HugeiconsIcon icon={Book01Icon} size={22} strokeWidth={2} />
            </span>
            <div>
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Prácticas pedagógicas
              </span>
              <h3 className="text-foreground text-base font-semibold">Sesiones de clase hoy</h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-foreground text-2xl font-extrabold sm:text-3xl">
              {sesiones.totalSesiones}
            </span>
            <span className="text-muted-foreground block text-[11px]">programadas</span>
          </div>
        </div>

        {/* Desglose de estados en minitarjetas */}
        <div className="mt-5 grid grid-cols-3 gap-2 text-xs sm:grid-cols-5">
          <div className="rounded-lg bg-emerald-500/10 p-2 text-center text-emerald-800 dark:text-emerald-300">
            <span className="block text-[10px] font-medium opacity-80">Cumplidas</span>
            <span className="text-base font-bold">{sesiones.cumplidas}</span>
          </div>
          <div className="rounded-lg bg-amber-500/10 p-2 text-center text-amber-800 dark:text-amber-300">
            <span className="block text-[10px] font-medium opacity-80">En curso</span>
            <span className="text-base font-bold">{sesiones.enCurso}</span>
          </div>
          <div className="rounded-lg bg-sky-500/10 p-2 text-center text-sky-800 dark:text-sky-300">
            <span className="block text-[10px] font-medium opacity-80">Pendientes</span>
            <span className="text-base font-bold">{sesiones.pendientes}</span>
          </div>
          <div className="rounded-lg bg-rose-500/10 p-2 text-center text-rose-800 dark:text-rose-300">
            <span className="block text-[10px] font-medium opacity-80">No cumplidas</span>
            <span className="text-base font-bold">{sesiones.noCumplidas}</span>
          </div>
          <div className="col-span-2 rounded-lg bg-purple-500/10 p-2 text-center text-purple-800 sm:col-span-1 dark:text-purple-300">
            <span className="block text-[10px] font-medium opacity-80">Justificadas</span>
            <span className="text-base font-bold">{sesiones.justificadas}</span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mt-4 text-[11px]">
        Las sesiones firmadas por los docentes actualizan el CSP en tiempo real durante la jornada.
      </p>
    </div>
  );
}
