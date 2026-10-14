"use client";

import * as React from "react";
import { Clock01Icon, School01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { SesionParaRegistroAusencia } from "./types";

interface ResumenSesionAusenciaProps {
  sesion: SesionParaRegistroAusencia;
}

/**
 * Muestra el contexto y horario programado de la sesión en la que se registrará la ausencia.
 */
export function ResumenSesionAusencia({ sesion }: ResumenSesionAusenciaProps) {
  return (
    <div className="bg-muted/40 border-border/70 rounded-2xl border p-3.5 text-xs">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={School01Icon}
            className="text-primary size-4 shrink-0"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1 truncate">
            <span className="text-muted-foreground">Sesión: </span>
            <span className="text-foreground font-semibold">
              {sesion.cursoNombre} ({sesion.seccionNombre})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={UserIcon}
            className="text-primary size-4 shrink-0"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1 truncate">
            <span className="text-muted-foreground">Docente: </span>
            <span className="text-foreground font-semibold">{sesion.docenteNombre}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <HugeiconsIcon
            icon={Clock01Icon}
            className="text-primary size-4 shrink-0"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <span className="text-muted-foreground">Horario de clase: </span>
            <span className="text-foreground font-mono font-semibold">
              {sesion.horaInicio} a {sesion.horaFin}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
