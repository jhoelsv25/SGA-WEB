import { StatusBadge } from "@/components/common/status-badge";
import { ESTADOS_OBSERVACION_CONFIG } from "../consts";
import type { EstadoObservacion } from "../types";

export function EstadoObservacionBadge({ estado }: { estado: EstadoObservacion }) {
  const config = ESTADOS_OBSERVACION_CONFIG[estado];
  return (
    <StatusBadge tone={config.tone} dot>
      {config.label}
    </StatusBadge>
  );
}
