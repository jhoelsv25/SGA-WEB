import * as React from "react";
import { Badge } from "@/components/ui/badge";
import type { AusenciaResponseDto } from "../../types";
import { esDescargoPermitido, formatearFechaLimite } from "../../utils";

interface EstadoAusenciaBadgeProps {
  ausencia: AusenciaResponseDto;
  className?: string;
}

/**
 * Muestra el estado del ciclo de vida y descargo de la ausencia docente.
 */
export function EstadoAusenciaBadge({ ausencia, className }: EstadoAusenciaBadgeProps) {
  if (ausencia.anulada) {
    return (
      <Badge variant="destructive" className={className}>
        Anulada
      </Badge>
    );
  }

  if (ausencia.descargo !== null) {
    return (
      <Badge variant="success" className={className}>
        Con descargo
      </Badge>
    );
  }

  const dentroDePlazo = esDescargoPermitido(ausencia);
  const fechaLimite =
    ausencia.fechaLimiteDescargoFormateada ?? formatearFechaLimite(ausencia.fechaLimiteDescargo);

  if (!dentroDePlazo) {
    return (
      <Badge variant="secondary" className={className}>
        Plazo vencido
      </Badge>
    );
  }

  return (
    <Badge variant="warning" className={className}>
      {fechaLimite !== "-" ? `Plazo hasta ${fechaLimite}` : "Pendiente"}
    </Badge>
  );
}
