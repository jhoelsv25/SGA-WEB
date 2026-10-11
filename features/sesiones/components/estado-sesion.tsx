import { StatusBadge } from "@/components/common/status-badge";
import { ESTADOS_JUSTIFICACION_LABEL, ESTADOS_SESION_CONFIG } from "../consts";
import type { Sesion } from "../types";

export function EstadoSesionBadge({ sesion }: { sesion: Sesion }) {
  const estado = ESTADOS_SESION_CONFIG[sesion.estado];
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <StatusBadge tone={estado.tone} dot size="sm">
        {estado.label}
        {sesion.minutosPerdidos > 0 && ` · ${sesion.minutosPerdidos} min`}
      </StatusBadge>
      {sesion.justificacion && sesion.estado !== "justificada" && (
        <StatusBadge
          tone={sesion.justificacion.estado === "rechazada" ? "danger" : "info"}
          size="sm"
        >
          {ESTADOS_JUSTIFICACION_LABEL[sesion.justificacion.estado]}
        </StatusBadge>
      )}
    </div>
  );
}

export function HorasFirmadas({ sesion }: { sesion: Sesion }) {
  if (!sesion.horaIngreso) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="font-mono text-xs">
      {sesion.horaIngreso} – {sesion.horaSalida ?? "…"}
      {sesion.salidaAutomatica && (
        <span className="text-muted-foreground font-sans"> (salida automática)</span>
      )}
    </span>
  );
}
