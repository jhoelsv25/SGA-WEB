"use client";

import { CheckmarkCircle02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import type { CargaItemHorario } from "../types";

interface ListaCursosCargaProps {
  cargaItems: CargaItemHorario[];
  cursoSeleccionado: CargaItemHorario | null;
  onSelectCurso: (curso: CargaItemHorario | null) => void;
  puedeGestionar: boolean;
}

export function ListaCursosCarga({
  cargaItems,
  cursoSeleccionado,
  onSelectCurso,
  puedeGestionar,
}: ListaCursosCargaProps) {
  if (cargaItems.length === 0) {
    return (
      <div className="border-border/80 text-muted-foreground rounded-xl border border-dashed p-4 text-center text-xs">
        Esta sección no tiene cursos registrados en su carga académica.
      </div>
    );
  }

  return (
    <div className="border-border/80 bg-card rounded-xl border p-4 shadow-sm">
      <div className="border-border/60 flex flex-col gap-1 border-b pb-3">
        <h3 className="text-foreground text-sm font-semibold">Cursos de la sección</h3>
        <p className="text-muted-foreground text-xs">
          {puedeGestionar
            ? "Arrastra un curso a una franja horaria o selecciónalo con un clic para asignarlo con el teclado o pantalla táctil."
            : "Lista de cursos y docentes asignados a la sección."}
        </p>
      </div>

      {/* Indicador de curso seleccionado para asignación rápida */}
      {cursoSeleccionado && (
        <div className="border-primary/30 bg-primary/10 mt-3 flex items-center justify-between rounded-lg border p-2.5 text-xs">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-primary size-4" />
            <span>
              Curso seleccionado: <strong>{cursoSeleccionado.cursoNombre}</strong>. Haz clic en una
              franja libre para asignarlo.
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onSelectCurso(null)}
            className="h-11 min-h-11 min-w-11 gap-1 px-3 text-xs"
            aria-label="Desmarcar curso seleccionado"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
            <span>Desmarcar</span>
          </Button>
        </div>
      )}

      {/* Tarjetas de cursos */}
      <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1">
        {cargaItems.map((item) => {
          const isSelected = cursoSeleccionado?.id === item.id;
          const horasCompletas = item.horasHorario === item.horasPlan;
          const faltaHoras = item.horasHorario < item.horasPlan;

          return (
            <div
              key={item.id}
              draggable={puedeGestionar}
              onDragStart={(e) => {
                if (!puedeGestionar) return;
                e.dataTransfer.setData(
                  "application/json",
                  JSON.stringify({
                    cursoSeccionId: item.id,
                    cursoNombre: item.cursoNombre,
                  }),
                );
                e.dataTransfer.effectAllowed = "copy";
              }}
              onClick={() => {
                if (!puedeGestionar) return;
                onSelectCurso(isSelected ? null : item);
              }}
              className={`group flex min-h-[48px] cursor-pointer items-center justify-between rounded-lg border p-2.5 text-xs transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 ring-primary ring-2"
                  : "border-border/70 bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
              }`}
              role="button"
              tabIndex={puedeGestionar ? 0 : -1}
              onKeyDown={(e) => {
                if (!puedeGestionar) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectCurso(isSelected ? null : item);
                }
              }}
              aria-label={`Seleccionar curso ${item.cursoNombre}`}
              aria-pressed={isSelected}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="border-border/80 size-3.5 shrink-0 rounded-full border shadow-xs"
                  style={{ backgroundColor: item.colorHex ?? "var(--primary)" }}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-foreground truncate font-semibold">{item.cursoNombre}</p>
                  <p className="text-muted-foreground truncate">
                    {item.docente ? item.docente.nombreCompleto : "Sin docente asignado"}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span
                  className={`inline-block font-mono font-medium ${
                    horasCompletas
                      ? "text-success-text"
                      : faltaHoras
                        ? "text-warning-text"
                        : "text-destructive"
                  }`}
                >
                  {item.horasHorario}/{item.horasPlan} h
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
