"use client";

import { Clock01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import type { BloquePropuesta, CargaItemHorario } from "../../types";
import { formatearRangoHora } from "../../utils";
import { cn } from "@/lib/utils";

interface CeldaPropuestaProps {
  propuesta: BloquePropuesta;
  diaNombre: string;
  puedeGestionar: boolean;
  cursoSeleccionado: CargaItemHorario | null;
  onAsignarCursoASlot: (
    diaSemana: number,
    horaInicio: string,
    horaFin: string,
    tipoBloque: "clase" | "receso",
    cursoSeccionId?: string | null,
  ) => void;
  onAbrirNuevoBloque: (
    diaSemana: number,
    horaInicio?: string,
    horaFin?: string,
    tipoBloque?: "clase" | "receso",
  ) => void;
}

export function CeldaPropuesta({
  propuesta,
  diaNombre,
  puedeGestionar,
  cursoSeleccionado,
  onAsignarCursoASlot,
  onAbrirNuevoBloque,
}: CeldaPropuestaProps) {
  const esReceso = propuesta.tipoBloque === "receso";

  if (esReceso) {
    return (
      <div className="group flex h-full min-h-14 flex-col justify-between rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 p-2 text-xs transition-colors hover:bg-amber-500/10">
        <div className="flex items-center justify-between gap-1">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
            Receso propuesto
          </span>
          <span className="font-mono text-[10px] text-amber-700/80 dark:text-amber-400/80">
            {formatearRangoHora(propuesta.horaInicio, propuesta.horaFin)}
          </span>
        </div>
        {puedeGestionar && (
          <div className="mt-1 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onAsignarCursoASlot(
                  propuesta.diaSemana,
                  propuesta.horaInicio,
                  propuesta.horaFin,
                  "receso",
                  null,
                )
              }
              className="h-7 border-amber-500/40 bg-amber-500/10 px-2.5 text-[11px] font-medium text-amber-800 hover:bg-amber-500/20 dark:text-amber-300"
              aria-label={`Fijar receso escolar el ${diaNombre} de ${propuesta.horaInicio} a ${propuesta.horaFin}`}
            >
              Fijar receso
            </Button>
          </div>
        )}
      </div>
    );
  }

  const handleAccion = () => {
    if (!puedeGestionar) return;
    if (cursoSeleccionado) {
      onAsignarCursoASlot(
        propuesta.diaSemana,
        propuesta.horaInicio,
        propuesta.horaFin,
        "clase",
        cursoSeleccionado.id,
      );
    } else {
      onAbrirNuevoBloque(propuesta.diaSemana, propuesta.horaInicio, propuesta.horaFin, "clase");
    }
  };

  return (
    <div
      className={cn(
        "group flex h-full min-h-15 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-2 transition-all",
        cursoSeleccionado
          ? "border-primary/60 bg-primary/10 hover:border-primary hover:bg-primary/20 ring-primary/30 ring-1"
          : "border-border/40 bg-muted/5 hover:border-primary/40 hover:bg-muted/20",
      )}
      role={puedeGestionar ? "button" : undefined}
      tabIndex={puedeGestionar ? 0 : -1}
      onClick={handleAccion}
      onKeyDown={(e) => {
        if (!puedeGestionar) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleAccion();
        }
      }}
      aria-label={`Franja disponible ${diaNombre} de ${propuesta.horaInicio} a ${propuesta.horaFin}`}
    >
      {cursoSeleccionado ? (
        <div className="flex flex-col items-center gap-1 text-center">
          <HugeiconsIcon icon={PlusSignIcon} className="text-primary size-4 animate-pulse" />
          <span className="text-primary text-[11px] leading-tight font-bold">
            Asignar {cursoSeleccionado.cursoNombre}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-0.5 opacity-35 transition-opacity group-hover:opacity-100">
          <HugeiconsIcon
            icon={PlusSignIcon}
            className="text-muted-foreground group-hover:text-primary size-3.5 transition-colors"
          />
          <span className="text-muted-foreground group-hover:text-foreground text-[10px] font-medium transition-colors">
            Disponible
          </span>
        </div>
      )}
    </div>
  );
}
