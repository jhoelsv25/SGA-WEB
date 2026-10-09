"use client";

import { Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import type { BloquePropuesta, CargaItemHorario } from "../../types";
import { formatearRangoHora } from "../../utils";

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
      <div className="border-border/80 bg-muted/40 flex h-full min-h-[58px] flex-col justify-between rounded-lg border border-dashed p-2 text-xs">
        <div className="text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1 font-medium">
            <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
            Receso propuesto
          </span>
          <span className="font-mono text-[10px]">
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
              className="h-11 min-h-11 min-w-11 px-3.5 text-xs font-medium"
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
      className={`flex h-full min-h-[72px] flex-col justify-between rounded-lg border-2 border-dashed p-2 transition-colors ${
        cursoSeleccionado
          ? "border-primary/60 bg-primary/10 hover:border-primary hover:bg-primary/20"
          : "border-border/60 bg-muted/10 hover:border-primary/40 hover:bg-muted/30"
      }`}
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
      aria-label={`Franja propuesta ${diaNombre} de ${propuesta.horaInicio} a ${propuesta.horaFin}`}
    >
      <div className="text-muted-foreground flex items-center justify-between">
        <span className="text-[11px] font-medium">Franja libre</span>
        <span className="font-mono text-[10px]">
          {formatearRangoHora(propuesta.horaInicio, propuesta.horaFin)}
        </span>
      </div>

      {puedeGestionar && (
        <div className="mt-1 flex items-center justify-center">
          {cursoSeleccionado ? (
            <span className="text-primary font-medium">
              Asignar {cursoSeleccionado.cursoNombre}
            </span>
          ) : (
            <span className="text-muted-foreground/80 text-[11px]">Arrastra aquí o haz clic</span>
          )}
        </div>
      )}
    </div>
  );
}
