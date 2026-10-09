"use client";

import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { SelectOption, type SelectOptionItem } from "@/components/common/select";
import type { Grado } from "@/features/grados";
import type { SeccionHorarioItem } from "../types";

interface SelectorGradoSeccionProps {
  grados: Grado[];
  gradoSeleccionadoId: string | null;
  onSelectGrado: (gradoId: string) => void;
  secciones: SeccionHorarioItem[];
  seccionSeleccionadaId: string | null;
  onSelectSeccion: (seccionId: string) => void;
  isLoadingSecciones?: boolean;
}

export function SelectorGradoSeccion({
  grados,
  gradoSeleccionadoId,
  onSelectGrado,
  secciones,
  seccionSeleccionadaId,
  onSelectSeccion,
  isLoadingSecciones = false,
}: SelectorGradoSeccionProps) {
  const gradoOptions = useMemo<SelectOptionItem[]>(() => {
    return grados.map((g) => ({
      value: g.id,
      label: g.nombre,
    }));
  }, [grados]);

  const seccionOptions = useMemo<SelectOptionItem[]>(() => {
    return secciones.map((sec) => ({
      value: sec.id,
      label: `Sección ${sec.nombre}`,
    }));
  }, [secciones]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      {/* Selector de grado */}
      <div className="w-full sm:w-64">
        <Label className="text-muted-foreground text-xs font-medium">Grado escolar</Label>
        <div className="mt-1">
          <SelectOption
            options={gradoOptions}
            value={gradoSeleccionadoId ?? ""}
            onSelect={(val) => onSelectGrado(val)}
            placeholder="Selecciona un grado"
            searchPlaceholder="Buscar grado..."
            emptyMessage="No se encontraron grados"
            className="min-h-11 w-full"
          />
        </div>
      </div>

      {/* Selector de sección */}
      <div className="w-full sm:w-64">
        <Label className="text-muted-foreground text-xs font-medium">Sección escolar</Label>
        <div className="mt-1">
          <SelectOption
            options={seccionOptions}
            value={seccionSeleccionadaId ?? ""}
            onSelect={(val) => onSelectSeccion(val)}
            disabled={!gradoSeleccionadoId || isLoadingSecciones || secciones.length === 0}
            placeholder={
              !gradoSeleccionadoId
                ? "Primero elige un grado"
                : isLoadingSecciones
                  ? "Cargando secciones..."
                  : secciones.length === 0
                    ? "Sin secciones en el grado"
                    : "Selecciona una sección"
            }
            searchPlaceholder="Buscar sección..."
            emptyMessage="No se encontraron secciones"
            className="min-h-11 w-full"
          />
        </div>
      </div>
    </div>
  );
}
