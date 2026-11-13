"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LibroNotasFiltrosProps {
  busqueda: string;
  onBusquedaChange: (val: string) => void;
  tipoFiltro: string;
  onTipoFiltroChange: (tipo: string) => void;
  conteoPorTipo: Record<string, number>;
  totalTareas: number;
}

const NOMBRES_TIPOS: Record<string, string> = {
  trabajo: "Trabajos",
  proyecto: "Proyectos",
  cuestionario: "Cuestionarios",
  examen: "Exámenes",
};

export function LibroNotasFiltros({
  busqueda,
  onBusquedaChange,
  tipoFiltro,
  onTipoFiltroChange,
  conteoPorTipo,
  totalTareas,
}: LibroNotasFiltrosProps) {
  const tiposDisponibles = Object.keys(conteoPorTipo);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Buscador de estudiante */}
      <div className="relative w-full max-w-sm">
        <HugeiconsIcon
          icon={Search01Icon}
          size={16}
          className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
        />
        <Input
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          placeholder="Buscar estudiante por nombre o código..."
          className="h-9 pl-9 text-xs"
        />
      </div>

      {/* Selector de tipo de evaluación */}
      {tiposDisponibles.length > 1 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            type="button"
            variant={tipoFiltro === "todos" ? "default" : "outline"}
            size="sm"
            className="h-8 rounded-lg px-2.5 text-xs font-medium"
            onClick={() => onTipoFiltroChange("todos")}
          >
            Todas ({totalTareas})
          </Button>

          {tiposDisponibles.map((tipo) => (
            <Button
              key={tipo}
              type="button"
              variant={tipoFiltro === tipo ? "default" : "outline"}
              size="sm"
              className="h-8 rounded-lg px-2.5 text-xs font-medium"
              onClick={() => onTipoFiltroChange(tipo)}
            >
              {NOMBRES_TIPOS[tipo] || tipo} ({conteoPorTipo[tipo]})
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
