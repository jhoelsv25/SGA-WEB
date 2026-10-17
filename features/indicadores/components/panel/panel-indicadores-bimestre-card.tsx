"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Analytics01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MENU_INDICADORES } from "../../consts";
import type { IndicadoresBimestreActualDto } from "../../types";

export interface PanelIndicadoresBimestreCardProps {
  indicadores: IndicadoresBimestreActualDto;
  className?: string;
}

/**
 * Tarjeta de resumen de los tres indicadores de eficacia de la tesis (CSP, ISA, IGM)
 * para el período o bimestre en curso, con acceso directo al tablero general.
 */
export function PanelIndicadoresBimestreCard({
  indicadores,
  className = "",
}: PanelIndicadoresBimestreCardProps) {
  const formatearValor = (valor: number | null): string => {
    if (valor === null || valor === undefined || Number.isNaN(valor)) {
      return "Sin datos";
    }
    return `${valor.toFixed(2)} %`;
  };

  return (
    <div
      className={`border-border/60 bg-card flex flex-col justify-between rounded-2xl border p-5 shadow-xs ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span
              className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl"
              aria-hidden="true"
            >
              <HugeiconsIcon icon={Analytics01Icon} size={22} strokeWidth={2} />
            </span>
            <div>
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Eficacia de la investigación
              </span>
              <h3 className="text-foreground text-base font-semibold">
                Indicadores de la tesis ({indicadores.periodoNombre ?? "Bimestre actual"})
              </h3>
            </div>
          </div>

          {indicadores.enCurso ? (
            <Badge
              variant="outline"
              className="border-amber-500/40 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-400"
            >
              En curso
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              Consolidado
            </Badge>
          )}
        </div>

        {/* Mosaico de los 3 indicadores */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* CSP */}
          <div className="border-border/60 bg-muted/30 rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-[#7A1228] uppercase dark:text-[#E27D8C]">
                CSP
              </span>
              <span className="text-muted-foreground text-[10px]">Sesiones</span>
            </div>
            <div className="text-foreground mt-1 text-xl font-extrabold sm:text-2xl">
              {formatearValor(indicadores.cspPorcentaje)}
            </div>
            <p className="text-muted-foreground mt-0.5 line-clamp-1 text-[10px]">
              Prácticas pedagógicas
            </p>
          </div>

          {/* ISA */}
          <div className="border-border/60 bg-muted/30 rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-blue-800 uppercase dark:text-blue-300">
                ISA
              </span>
              <span className="text-muted-foreground text-[10px]">Libretas</span>
            </div>
            <div className="text-foreground mt-1 text-xl font-extrabold sm:text-2xl">
              {formatearValor(indicadores.isaPorcentaje)}
            </div>
            <p className="text-muted-foreground mt-0.5 line-clamp-1 text-[10px]">
              Seguimiento académico
            </p>
          </div>

          {/* IGM */}
          <div className="border-border/60 bg-muted/30 rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-teal-800 uppercase dark:text-teal-300">
                IGM
              </span>
              <span className="text-muted-foreground text-[10px]">Materiales</span>
            </div>
            <div className="text-foreground mt-1 text-xl font-extrabold sm:text-2xl">
              {formatearValor(indicadores.igmPorcentaje)}
            </div>
            <p className="text-muted-foreground mt-0.5 line-clamp-1 text-[10px]">Aula virtual</p>
          </div>
        </div>
      </div>

      {/* Enlace hacia el tablero completo */}
      <div className="border-border/60 mt-5 flex items-center justify-between border-t pt-4">
        <span className="text-muted-foreground text-xs">
          Comparaciones pretest-postest y filtros detallados
        </span>
        <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
          <Link href={MENU_INDICADORES}>
            <span>Ver tablero completo</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Link>
        </Button>
      </div>
    </div>
  );
}
