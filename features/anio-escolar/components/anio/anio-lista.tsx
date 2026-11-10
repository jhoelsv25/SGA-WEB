"use client";

import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/common/status-badge";
import type { AnioAcademico } from "../../types";
import { ESTADO_ANIO, TONO_ESTADO_ANIO } from "./estados";

interface AnioListaProps {
  anios: AnioAcademico[];
  seleccionadoId: string | null;
  onSeleccionar: (id: string) => void;
}

export function AnioLista({ anios, seleccionadoId, onSeleccionar }: AnioListaProps) {
  return (
    <div className="flex flex-row gap-2 overflow-x-auto pb-1">
      {anios.map((anio) => (
        <button
          key={anio.id}
          type="button"
          onClick={() => onSeleccionar(anio.id)}
          className={cn(
            "focus-visible:ring-primary/40 flex shrink-0 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors outline-none focus-visible:ring-2",
            seleccionadoId === anio.id
              ? "border-primary bg-primary/5 shadow-sm"
              : "bg-card hover:bg-muted/50",
          )}
        >
          <span className="text-sm font-semibold">{anio.anio}</span>
          <StatusBadge tone={TONO_ESTADO_ANIO[anio.estado]} dot={anio.estado === "en_curso"}>
            {ESTADO_ANIO[anio.estado]}
          </StatusBadge>
        </button>
      ))}
    </div>
  );
}
