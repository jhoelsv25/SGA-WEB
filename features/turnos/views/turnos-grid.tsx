"use client";

import * as React from "react";
import type { TipoPersona, Turno } from "../types";
import { TurnoCard } from "./turno-card";

export interface TurnosGridProps {
  turnos: Turno[];
  onEditTurno: (turno: Turno) => void;
  onCreateTurno: (tipoPersona: TipoPersona) => void;
  onToggleActivo: (turno: Turno, activo: boolean) => void;
  isToggling?: boolean;
}

const SHIFT_TYPES: TipoPersona[] = ["estudiantes", "docentes", "administrativos"];

export function TurnosGrid({
  turnos,
  onEditTurno,
  onCreateTurno,
  onToggleActivo,
  isToggling = false,
}: TurnosGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {SHIFT_TYPES.map((tipo) => {
        const turno = turnos.find((t) => t.tipoPersona === tipo);
        return (
          <TurnoCard
            key={tipo}
            tipoPersona={tipo}
            turno={turno}
            onEditTurno={onEditTurno}
            onCreateTurno={onCreateTurno}
            onToggleActivo={onToggleActivo}
            isToggling={isToggling}
          />
        );
      })}
    </div>
  );
}
