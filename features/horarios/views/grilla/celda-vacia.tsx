"use client";

import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import type { CargaItemHorario } from "../../types";

interface CeldaVaciaProps {
  diaSemana: number;
  diaNombre: string;
  inicio: string;
  fin: string;
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

export function CeldaVacia({
  diaSemana,
  diaNombre,
  inicio,
  fin,
  puedeGestionar,
  cursoSeleccionado,
  onAsignarCursoASlot,
  onAbrirNuevoBloque,
}: CeldaVaciaProps) {
  const handleClick = () => {
    if (cursoSeleccionado) {
      onAsignarCursoASlot(diaSemana, inicio, fin, "clase", cursoSeleccionado.id);
    } else {
      onAbrirNuevoBloque(diaSemana, inicio, fin, "clase");
    }
  };

  return (
    <div
      className={`flex h-full min-h-[50px] items-center justify-center rounded-lg border border-transparent transition-colors ${
        puedeGestionar ? "hover:border-border/80 hover:bg-muted/20 hover:border-dashed" : ""
      }`}
    >
      {puedeGestionar && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClick}
          className="text-muted-foreground hover:bg-muted hover:text-foreground size-11 min-h-11 min-w-11 rounded-full"
          aria-label={`Registrar bloque el ${diaNombre} a las ${inicio}`}
        >
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
        </Button>
      )}
    </div>
  );
}
