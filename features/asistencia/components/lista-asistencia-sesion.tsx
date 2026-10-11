"use client";

import * as React from "react";
import { StatusBadge } from "@/components/common/status-badge";
import { cn } from "@/lib/utils";
import { ESTADOS_ASISTENCIA_CONFIG, OPCIONES_DOCENTE } from "../consts";
import type { EstadoAsistencia, EstadoMarcableDocente, EstudianteListaAsistencia } from "../types";

interface ListaAsistenciaSesionProps {
  estudiantes: EstudianteListaAsistencia[];
  estados: Record<string, EstadoAsistencia>;
  editable: boolean;
  onCambiar: (matriculaId: string, estado: EstadoMarcableDocente) => void;
}

export function ListaAsistenciaSesion({
  estudiantes,
  estados,
  editable,
  onCambiar,
}: ListaAsistenciaSesionProps) {
  return (
    <ul className="divide-border/60 divide-y" aria-label="Estudiantes de la sección">
      {estudiantes.map((e, indice) => {
        const estado = estados[e.matriculaId] ?? "presente";
        const justificada = estado === "falta_justificada";
        return (
          <li key={e.matriculaId} className="flex flex-wrap items-center gap-3 py-2.5">
            <span className="text-muted-foreground w-6 text-right text-xs tabular-nums">
              {indice + 1}
            </span>
            <div className="min-w-0 flex-1 basis-40 space-y-1">
              <p className="text-sm font-medium wrap-break-word">{e.nombreCompleto}</p>
              {e.noMarcoIngreso && (
                <StatusBadge tone="warning" size="sm">
                  No marcó ingreso
                </StatusBadge>
              )}
            </div>
            {justificada ? (
              <StatusBadge tone="info" size="sm">
                {ESTADOS_ASISTENCIA_CONFIG.falta_justificada.label}
              </StatusBadge>
            ) : (
              <div
                role="radiogroup"
                aria-label={`Asistencia de ${e.nombreCompleto}`}
                className="bg-muted/60 inline-flex rounded-xl p-1 text-xs"
              >
                {OPCIONES_DOCENTE.map((opcion) => (
                  <button
                    key={opcion.value}
                    type="button"
                    role="radio"
                    aria-checked={estado === opcion.value}
                    disabled={!editable}
                    onClick={() => onCambiar(e.matriculaId, opcion.value)}
                    className={cn(
                      "min-h-10 rounded-lg px-3 font-semibold transition-all disabled:cursor-not-allowed",
                      estado === opcion.value
                        ? opcion.value === "presente"
                          ? "bg-success/15 text-success-text"
                          : opcion.value === "tardanza"
                            ? "bg-warning/20 text-warning-text"
                            : "bg-destructive/15 text-destructive"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {opcion.label}
                  </button>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
