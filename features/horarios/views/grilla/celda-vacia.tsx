"use client";

import { cn } from "@/lib/utils";
import type { CargaItemHorario } from "../../types";
import { convertirHoraAMinutos, minutosAHora } from "../../utils";

interface CeldaVaciaProps {
  diaSemana: number;
  diaNombre: string;
  inicio: string;
  fin: string;
  duracionSugeridaMinutos?: number;
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
  duracionSugeridaMinutos = 45,
  puedeGestionar,
  cursoSeleccionado,
  onAsignarCursoASlot,
  onAbrirNuevoBloque,
}: CeldaVaciaProps) {
  const handleClick = () => {
    // Si la celda es un slot atómico de 15 min, sugerir la duración de una clase ordinaria (ej. 45 min)
    const minIni = convertirHoraAMinutos(inicio);
    const finSugerido = duracionSugeridaMinutos
      ? minutosAHora(minIni + duracionSugeridaMinutos)
      : fin;

    if (cursoSeleccionado) {
      onAsignarCursoASlot(diaSemana, inicio, finSugerido, "clase", cursoSeleccionado.id);
    } else {
      onAbrirNuevoBloque(diaSemana, inicio, finSugerido, "clase");
    }
  };

  return (
    <div
      onClick={puedeGestionar ? handleClick : undefined}
      role={puedeGestionar ? "button" : undefined}
      tabIndex={puedeGestionar ? 0 : undefined}
      onKeyDown={(e) => {
        if (puedeGestionar && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        "group flex h-full min-h-[30px] items-center justify-center rounded-md border border-transparent transition-all",
        puedeGestionar &&
          "hover:border-border/60 hover:bg-muted/25 focus-visible:ring-primary cursor-pointer focus-visible:ring-1 focus-visible:outline-none",
        cursoSeleccionado && "hover:border-primary/50 hover:bg-primary/10",
      )}
      aria-label={`Asignar clase el ${diaNombre} a las ${inicio}`}
    >
      {puedeGestionar && (
        <span className="text-muted-foreground/30 group-hover:text-muted-foreground text-xs font-semibold transition-all select-none group-hover:scale-125">
          +
        </span>
      )}
    </div>
  );
}
