"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Login01Icon, Logout01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { TipoMarcacion, TurnoInfo } from "../types";

interface KioskoSelectorTipoProps {
  tipo: TipoMarcacion;
  onCambiarTipo: (nuevoTipo: TipoMarcacion) => void;
  turnoInfo: TurnoInfo;
}

export function KioskoSelectorTipo({ tipo, onCambiarTipo, turnoInfo }: KioskoSelectorTipoProps) {
  return (
    <div className="space-y-3">
      {/* Información del turno actual detectado */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">
          {turnoInfo.nombre} ({turnoInfo.horario})
        </span>
        <span className="text-primary font-semibold">
          Sugerido: {turnoInfo.tipoSugerido === "entrada" ? "Entrada" : "Salida"}
        </span>
      </div>

      {/* Selector ergonómico de Entrada / Salida */}
      <div
        role="group"
        aria-label="Selección de tipo de evento de asistencia"
        className="border-border/80 bg-muted/50 grid grid-cols-2 gap-1.5 rounded-2xl border p-1"
      >
        <button
          type="button"
          onClick={() => onCambiarTipo("entrada")}
          aria-pressed={tipo === "entrada"}
          className={cn(
            "flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all outline-none select-none",
            "focus-visible:ring-primary/40 focus-visible:ring-2",
            tipo === "entrada"
              ? "bg-primary text-primary-foreground shadow-primary/20 shadow-md"
              : "text-muted-foreground hover:text-foreground hover:bg-card/60",
          )}
        >
          <HugeiconsIcon icon={Login01Icon} className="size-4.5" aria-hidden="true" />
          <span>ENTRADA</span>
        </button>

        <button
          type="button"
          onClick={() => onCambiarTipo("salida")}
          aria-pressed={tipo === "salida"}
          className={cn(
            "flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all outline-none select-none",
            "focus-visible:ring-primary/40 focus-visible:ring-2",
            tipo === "salida"
              ? "bg-primary text-primary-foreground shadow-primary/20 shadow-md"
              : "text-muted-foreground hover:text-foreground hover:bg-card/60",
          )}
        >
          <HugeiconsIcon icon={Logout01Icon} className="size-4.5" aria-hidden="true" />
          <span>SALIDA</span>
        </button>
      </div>
    </div>
  );
}
