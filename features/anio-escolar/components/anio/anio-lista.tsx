"use client";

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
    <div className="flex flex-col gap-2">
      {anios.map((anio) => (
        <button
          key={anio.id}
          type="button"
          onClick={() => onSeleccionar(anio.id)}
          className={`focus-visible:ring-primary/40 flex items-center justify-between rounded-lg border px-3 py-2 text-left outline-none focus-visible:ring-2 ${
            seleccionadoId === anio.id ? "border-primary bg-primary/5" : "bg-card"
          }`}
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
