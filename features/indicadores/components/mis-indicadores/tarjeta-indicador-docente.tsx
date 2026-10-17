"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, Clock01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import type { DesgloseCspDto, DesgloseIgmDto, IndicadorCalculadoDto } from "../../types";

export interface TarjetaIndicadorDocenteProps {
  indicador: IndicadorCalculadoDto<DesgloseCspDto> | IndicadorCalculadoDto<DesgloseIgmDto>;
  className?: string;
}

function esDesgloseCsp(desglose: DesgloseCspDto | DesgloseIgmDto): desglose is DesgloseCspDto {
  return "planificadas" in desglose && "cumplidas" in desglose;
}

/**
 * Tarjeta analítica del docente para visualizar su indicador (CSP o IGM),
 * su desglose cuantitativo, estado de período y fórmula matemática.
 */
export function TarjetaIndicadorDocente({
  indicador,
  className = "",
}: TarjetaIndicadorDocenteProps) {
  const esCsp = indicador.indicador === "CSP";
  const porcentaje = indicador.porcentaje;
  const sinDatos = indicador.sinDatos || porcentaje === null;

  return (
    <div
      className={`border-border/60 bg-card flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition-shadow hover:shadow-sm ${className}`}
    >
      <div>
        {/* Cabecera de la tarjeta */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={`flex size-10 items-center justify-center rounded-xl ${
                esCsp
                  ? "bg-[#7A1228]/10 text-[#7A1228] dark:bg-[#7A1228]/20 dark:text-[#E27D8C]"
                  : "bg-teal-500/10 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300"
              }`}
              aria-hidden="true"
            >
              <HugeiconsIcon icon={esCsp ? Clock01Icon : Book02Icon} size={22} strokeWidth={2} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                  {indicador.indicador}
                </span>
                <span className="text-muted-foreground text-xs">·</span>
                <span className="text-muted-foreground text-xs font-medium">
                  {indicador.dimension}
                </span>
              </div>
              <h3 className="text-foreground text-sm font-semibold sm:text-base">
                {indicador.nombre}
              </h3>
            </div>
          </div>

          {indicador.enCurso && (
            <Badge
              variant="outline"
              className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
            >
              En curso
            </Badge>
          )}
        </div>

        {/* Métrica principal en grande */}
        <div className="mt-5 flex items-baseline justify-between gap-2 border-b pb-4">
          <div>
            <div className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
              {sinDatos ? "Sin datos" : indicador.porcentajeTexto}
            </div>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {sinDatos
                ? (indicador.mensajeSinDatos ??
                  "No hay datos para el periodo y los filtros elegidos.")
                : esCsp
                  ? `${indicador.numerador} de ${indicador.denominador} sesiones efectivas`
                  : `${indicador.numerador} de ${indicador.denominador} materiales planificados`}
            </p>
          </div>

          {/* Mini medidor visual en SVG */}
          <div className="size-14 shrink-0" aria-hidden="true">
            <svg viewBox="0 0 36 36" className="size-full">
              <path
                className="text-muted/30 stroke-current"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {!sinDatos && (
                <path
                  className={
                    esCsp
                      ? "stroke-[#7A1228] dark:stroke-[#A32035]"
                      : "stroke-[#0F766E] dark:stroke-[#14B8A6]"
                  }
                  strokeDasharray={`${Math.max(0, Math.min(100, porcentaje ?? 0))}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              )}
            </svg>
          </div>
        </div>

        {/* Desglose cuantitativo detallado */}
        <div className="mt-4 space-y-2">
          <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Desglose cuantitativo
          </div>

          {esDesgloseCsp(indicador.desglose) ? (
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
              <div className="bg-muted/40 rounded-lg p-2">
                <span className="text-muted-foreground block text-[11px]">Planificadas</span>
                <span className="text-foreground font-semibold">
                  {indicador.desglose.planificadas}
                </span>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-800 dark:text-emerald-300">
                <span className="block text-[11px] opacity-80">Cumplidas</span>
                <span className="font-semibold">{indicador.desglose.cumplidas}</span>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-2 text-amber-800 dark:text-amber-300">
                <span className="block text-[11px] opacity-80">Parciales</span>
                <span className="font-semibold">{indicador.desglose.parciales}</span>
              </div>
              <div className="rounded-lg bg-rose-500/10 p-2 text-rose-800 dark:text-rose-300">
                <span className="block text-[11px] opacity-80">No cumplidas</span>
                <span className="font-semibold">{indicador.desglose.noCumplidas}</span>
              </div>
              <div className="rounded-lg bg-purple-500/10 p-2 text-purple-800 dark:text-purple-300">
                <span className="block text-[11px] opacity-80">Justificadas</span>
                <span className="font-semibold">{indicador.desglose.justificadas}</span>
              </div>
              <div className="bg-muted/60 rounded-lg p-2">
                <span className="text-muted-foreground block text-[11px]">Denominador efect.</span>
                <span className="text-foreground font-bold">
                  {indicador.desglose.denominadorEfectivo}
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
              <div className="bg-muted/40 rounded-lg p-2">
                <span className="text-muted-foreground block text-[11px]">Planificados</span>
                <span className="text-foreground font-semibold">
                  {indicador.desglose.planificados}
                </span>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-800 dark:text-emerald-300">
                <span className="block text-[11px] opacity-80">A tiempo</span>
                <span className="font-semibold">{indicador.desglose.publicadosATiempo}</span>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-2 text-amber-800 dark:text-amber-300">
                <span className="block text-[11px] opacity-80">Fuera de plazo</span>
                <span className="font-semibold">{indicador.desglose.publicadosFueraDePlazo}</span>
              </div>
              <div className="rounded-lg bg-rose-500/10 p-2 text-rose-800 dark:text-rose-300">
                <span className="block text-[11px] opacity-80">Pendientes</span>
                <span className="font-semibold">{indicador.desglose.pendientes}</span>
              </div>
              <div className="bg-muted/40 col-span-2 rounded-lg p-2 sm:col-span-2">
                <span className="text-muted-foreground block text-[11px]">
                  Materiales extra (no computan)
                </span>
                <span className="text-foreground font-semibold">{indicador.desglose.extras}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fórmula explicativa al pie */}
      <div className="border-border/50 text-muted-foreground mt-4 flex items-center gap-1.5 border-t pt-3 text-[11px]">
        <HugeiconsIcon icon={InformationCircleIcon} size={14} className="shrink-0" />
        <span className="font-mono">{indicador.formula}</span>
      </div>
    </div>
  );
}
