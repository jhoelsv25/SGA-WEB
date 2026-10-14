"use client";

import * as React from "react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { calcularMinutosEntre, formatearMinutos } from "../../utils";

interface CalculadorMinutosBadgeProps {
  horaDesde: string;
  horaHasta: string;
}

/**
 * Indicador visual que calcula y muestra en tiempo real los minutos de ausencia
 * según las horas ingresadas en el formulario.
 */
export function CalculadorMinutosBadge({ horaDesde, horaHasta }: CalculadorMinutosBadgeProps) {
  const minutos = React.useMemo(
    () => calcularMinutosEntre(horaDesde, horaHasta),
    [horaDesde, horaHasta],
  );

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
    >
      <HugeiconsIcon icon={Clock01Icon} className="size-3.5 shrink-0" aria-hidden="true" />
      <span>{minutos > 0 ? `Duración: ${formatearMinutos(minutos)}` : "0 min calculados"}</span>
    </div>
  );
}
