import * as React from "react";
import type { SesionResumenAusenciaDto } from "@/features/ausencias-docente/types";
import { formatearFechaLimite } from "@/features/ausencias-docente/utils";

interface ResumenSesionEdicionProps {
  sesion: SesionResumenAusenciaDto;
}

/**
 * Cabecera contextual informativa con los datos de la sesión para el formulario de corrección.
 */
export function ResumenSesionEdicion({ sesion }: ResumenSesionEdicionProps) {
  return (
    <div className="border-border/60 bg-muted/30 space-y-1 rounded-xl border p-3 text-xs">
      <p className="text-foreground font-semibold">{sesion.docenteNombre}</p>
      <p className="text-muted-foreground">
        {formatearFechaLimite(sesion.fecha)} · {sesion.cursoNombre} ({sesion.seccionNombre})
      </p>
      <p className="text-muted-foreground font-mono">
        Horario programado de la clase: {sesion.horaInicio} a {sesion.horaFin}
      </p>
    </div>
  );
}
