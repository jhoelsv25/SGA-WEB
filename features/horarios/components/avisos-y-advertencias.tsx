"use client";

import { AlertCircleIcon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface AvisosYAdvertenciasProps {
  mensajeVigencia?: string | null;
  advertencias?: string[];
  onDismissMensaje?: () => void;
}

export function AvisosYAdvertencias({
  mensajeVigencia,
  advertencias = [],
}: AvisosYAdvertenciasProps) {
  const tieneAvisos = Boolean(mensajeVigencia) || advertencias.length > 0;
  if (!tieneAvisos) return null;

  return (
    <div className="space-y-2.5">
      {/* Mensaje de vigencia oficial (ej. Los cambios rigen desde mañana) */}
      {mensajeVigencia && (
        <div
          role="status"
          aria-live="polite"
          className="border-info/30 bg-info/12 text-info-text flex items-start gap-2.5 rounded-lg border p-3 text-xs"
        >
          <HugeiconsIcon
            icon={InformationCircleIcon}
            className="text-info mt-0.5 size-4 shrink-0"
          />
          <div className="flex-1 font-medium">{mensajeVigencia}</div>
        </div>
      )}

      {/* Advertencias de horas frente al plan de estudios */}
      {advertencias.length > 0 && (
        <div
          role="alert"
          aria-live="polite"
          className="border-warning/30 bg-warning/12 text-warning-text rounded-lg border p-3 text-xs"
        >
          <div className="flex items-center gap-2 font-semibold">
            <HugeiconsIcon icon={AlertCircleIcon} className="text-warning size-4 shrink-0" />
            <span>Advertencias de consistencia con el plan de estudios:</span>
          </div>
          <ul className="mt-1.5 list-inside list-disc space-y-1 pl-1">
            {advertencias.map((adv, idx) => (
              <li key={idx}>{adv}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
