"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";

interface LibroNotasHeaderProps {
  periodoNombre: string;
  totalEstudiantes: number;
  pesosEfectivos: Record<string, number>;
  descargando: boolean;
  onDescargarExcel: () => void;
}

export function LibroNotasHeader({
  periodoNombre,
  totalEstudiantes,
  pesosEfectivos,
  descargando,
  onDescargarExcel,
}: LibroNotasHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Barra superior de pesos y acción de exportación */}
      <div className="bg-card flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-foreground text-base font-bold">
              Libro de Calificaciones · {periodoNombre}
            </h3>
            <StatusBadge tone="neutral">{totalEstudiantes} estudiantes</StatusBadge>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-foreground font-semibold">Pesos evaluativos:</span>
            {Object.entries(pesosEfectivos).map(([tipo, peso]) => (
              <span
                key={tipo}
                className="bg-muted text-foreground/80 rounded-md px-2 py-0.5 text-[11px] font-medium capitalize"
              >
                {tipo}: {peso}%
              </span>
            ))}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          id="btn-exportar-excel-notas"
          onClick={onDescargarExcel}
          disabled={descargando || totalEstudiantes === 0}
          className="gap-2 font-medium"
        >
          <HugeiconsIcon icon={Download01Icon} size={16} />
          <span>{descargando ? "Generando..." : "Exportar a Excel"}</span>
        </Button>
      </div>

      {/* Explicación de redistribución proporcional */}
      <div className="flex items-start gap-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 p-3 text-xs text-indigo-950 dark:border-indigo-950 dark:bg-indigo-950/20 dark:text-indigo-200">
        <HugeiconsIcon
          icon={InformationCircleIcon}
          size={16}
          className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
        />
        <span>
          Si un tipo de tarea no tiene actividades en el bimestre, su peso se redistribuye
          proporcionalmente entre los tipos evaluados. Las notas se convierten automáticamente a la
          escala literal oficial del MINEDU (AD, A, B, C).
        </span>
      </div>
    </div>
  );
}
