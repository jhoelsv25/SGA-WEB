"use client";

import { useState } from "react";
import {
  AlertCircleIcon,
  InformationCircleIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

interface AvisosYAdvertenciasProps {
  mensajeVigencia?: string | null;
  advertencias?: string[];
  onDismissMensaje?: () => void;
}

export function AvisosYAdvertencias({
  mensajeVigencia,
  advertencias = [],
}: AvisosYAdvertenciasProps) {
  const [expandido, setExpandido] = useState(false);
  const tieneAvisos = Boolean(mensajeVigencia) || advertencias.length > 0;
  if (!tieneAvisos) return null;

  return (
    <div className="space-y-2.5">
      {/* Mensaje de vigencia oficial (ej. Los cambios rigen desde mañana) */}
      {mensajeVigencia && (
        <div
          role="status"
          aria-live="polite"
          className="border-info/30 bg-info/12 text-info-text flex items-start gap-2.5 rounded-xl border p-3 text-xs"
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
          className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-xs text-amber-900 shadow-2xs transition-all dark:text-amber-200"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                className="size-4 shrink-0 text-amber-600 dark:text-amber-400"
              />
              <span>
                {advertencias.length === 1
                  ? "Hay 1 curso con horas pendientes frente al plan de estudios."
                  : `Hay ${advertencias.length} cursos con horas pendientes o descuadres frente al plan de estudios.`}
              </span>
            </div>
            {advertencias.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setExpandido(!expandido)}
                className="h-6 gap-1 rounded-md px-2.5 text-[11px] font-semibold text-amber-800 hover:bg-amber-500/20 dark:text-amber-300"
              >
                <span>{expandido ? "Ocultar lista" : `Ver detalle (${advertencias.length})`}</span>
                <HugeiconsIcon
                  icon={expandido ? ArrowUp01Icon : ArrowDown01Icon}
                  className="size-3"
                />
              </Button>
            )}
          </div>

          {(expandido || advertencias.length <= 2) && (
            <ul className="text-amber-850 mt-2.5 list-inside list-disc space-y-1 border-t border-amber-500/20 pt-2 pl-1 text-[11px] dark:text-amber-300/90">
              {advertencias.map((adv, idx) => (
                <li key={idx}>{adv}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
