"use client";

import * as React from "react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatters/date";
import { cn } from "@/lib/utils";
import type { Bimestre } from "@/features/anio-escolar/types";

interface SelectorBimestreProps {
  bimestres: Bimestre[];
  periodoSeleccionadoId?: string;
  onSelectPeriodo: (id: string) => void;
  disabled?: boolean;
}

/**
 * Selector interactivo y responsivo de bimestres para el seguimiento docente (HU3).
 * Muestra el estado del bimestre (en curso, cerrado o planificado) y su rango de fechas.
 */
export function SelectorBimestre({
  bimestres,
  periodoSeleccionadoId,
  onSelectPeriodo,
  disabled = false,
}: SelectorBimestreProps) {
  const bimestresOrdenados = React.useMemo(() => {
    return [...bimestres].sort((a, b) => a.numero - b.numero);
  }, [bimestres]);

  if (bimestresOrdenados.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="selector-bimestre"
          className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase"
        >
          <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-3.5" />
          <span>Bimestre de trabajo</span>
        </label>
        <span className="text-2xs text-muted-foreground">
          Seleccione el bimestre para consultar su consolidado
        </span>
      </div>

      <div
        id="selector-bimestre"
        role="radiogroup"
        aria-label="Selección de bimestre"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {bimestresOrdenados.map((bimestre) => {
          const seleccionado = bimestre.id === periodoSeleccionadoId;
          const fechaInicioTexto = formatDate(bimestre.fechaInicio, "dd/MM");
          const fechaFinTexto = formatDate(bimestre.fechaFin, "dd/MM");

          const estadoTexto =
            bimestre.estado === "en_curso"
              ? "En curso"
              : bimestre.estado === "cerrado"
                ? "Cerrado"
                : "Planificado";

          const estadoBadgeVariant =
            bimestre.estado === "en_curso"
              ? "default"
              : bimestre.estado === "cerrado"
                ? "secondary"
                : "outline";

          return (
            <button
              key={bimestre.id}
              type="button"
              role="radio"
              aria-checked={seleccionado}
              disabled={disabled}
              onClick={() => onSelectPeriodo(bimestre.id)}
              className={cn(
                "group relative flex flex-col items-start justify-between gap-2 rounded-2xl border p-3.5 text-left transition-all outline-none",
                "focus-visible:ring-primary/40 focus-visible:ring-2",
                seleccionado
                  ? "border-primary/60 bg-primary/5 ring-primary/30 shadow-xs ring-1"
                  : "border-border/60 bg-card hover:border-primary/40 hover:bg-muted/30",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <div className="flex w-full items-start justify-between gap-1.5">
                <span
                  className={cn(
                    "text-xs font-bold transition-colors",
                    seleccionado ? "text-primary" : "text-foreground",
                  )}
                >
                  {bimestre.nombre}
                </span>
                <Badge variant={estadoBadgeVariant} className="text-2xs px-1.5 py-0 font-medium">
                  {estadoTexto}
                </Badge>
              </div>

              <div className="text-2xs text-muted-foreground w-full">
                <span>
                  {fechaInicioTexto} - {fechaFinTexto}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
