"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Bimestre } from "@/features/anio-escolar/types";

export interface MisIndicadoresFiltroProps {
  bimestres: Bimestre[];
  periodoSeleccionado?: string;
  onPeriodoChange: (periodoId?: string) => void;
  className?: string;
}

/**
 * Filtro selector de bimestre para los indicadores propios del docente.
 */
export function MisIndicadoresFiltro({
  bimestres,
  periodoSeleccionado,
  onPeriodoChange,
  className = "",
}: MisIndicadoresFiltroProps) {
  const valorSelect = periodoSeleccionado ?? "todos";

  const handleValueChange = (valor: string) => {
    if (valor === "todos") {
      onPeriodoChange(undefined);
    } else {
      onPeriodoChange(valor);
    }
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <label
        htmlFor="selector-bimestre"
        className="text-muted-foreground shrink-0 text-xs font-medium"
      >
        Período académico:
      </label>
      <Select value={valorSelect} onValueChange={handleValueChange}>
        <SelectTrigger id="selector-bimestre" className="bg-card w-[210px] text-xs">
          <SelectValue placeholder="Seleccionar período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">
            <span className="font-medium">Todo el año académico</span>
          </SelectItem>
          {bimestres.map((b) => (
            <SelectItem key={b.id} value={b.id}>
              <span>{`Bimestre ${b.nombre}`}</span>
              {b.estado === "en_curso" && (
                <span className="ml-1.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  (En curso)
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
