"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, User02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { SelectOption, type SelectOptionItem } from "@/components/common/select";
import type { CargaItem } from "../../types";
import { SeccionCargaActions } from "./seccion-carga-actions";

export interface GetSeccionCargaColumnsOptions {
  puedeGestionar: boolean;
  docentesOptions: SelectOptionItem<string>[];
  docentesSeleccionados: Record<string, string>;
  onSelectDocente: (cursoSeccionId: string, docenteId: string) => void;
  guardandoFilaId: string | null;
  onGuardar: (cursoSeccionId: string, docenteId: string | null) => void;
}

export function getSeccionCargaColumns({
  puedeGestionar,
  docentesOptions,
  docentesSeleccionados,
  onSelectDocente,
  guardandoFilaId,
  onGuardar,
}: GetSeccionCargaColumnsOptions): ColumnDef<CargaItem>[] {
  const columns: ColumnDef<CargaItem>[] = [
    {
      id: "curso",
      header: "Curso",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "size-3.5 shrink-0 rounded-full border border-black/15 shadow-2xs dark:border-white/15",
                !item.colorHex && "bg-muted",
              )}
              style={item.colorHex ? { backgroundColor: item.colorHex } : undefined}
              title={item.colorHex ? `Color del curso: ${item.colorHex}` : "Sin color asignado"}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <span className="text-foreground block text-sm font-semibold">
                {item.cursoNombre}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "horasPlan",
      header: () => <div className="text-center">Horas del plan</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 font-medium">
              <span className="text-foreground font-semibold">{item.horasPlan}</span>
              <span className="text-muted-foreground text-xs">h/sem</span>
            </div>
          </div>
        );
      },
    },
    {
      id: "horasHorario",
      header: () => <div className="text-center">Horas en el horario</div>,
      cell: ({ row }) => {
        const item = row.original;
        const descuadre = item.horasHorario !== item.horasPlan;
        return (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 font-medium">
              <span className="text-foreground font-semibold">{item.horasHorario}</span>
              <span className="text-muted-foreground text-xs">h/sem</span>
              {descuadre && (
                <span
                  className="text-warning-text bg-warning/10 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                  title={`Difiere del plan de estudios (${item.horasPlan} horas)`}
                >
                  <HugeiconsIcon icon={Clock01Icon} className="mr-0.5 inline size-3" />
                  Descuadre
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "docente",
      header: "Docente asignado",
      cell: ({ row }) => {
        const item = row.original;
        const valorSeleccionado =
          docentesSeleccionados[item.id] !== undefined
            ? docentesSeleccionados[item.id]
            : (item.docente?.id ?? "");

        const guardandoEstaFila = guardandoFilaId === item.id;

        if (puedeGestionar) {
          return (
            <div
              role="group"
              aria-label={`Docente de ${item.cursoNombre}`}
              className="max-w-xs sm:max-w-sm"
            >
              <SelectOption
                options={docentesOptions}
                value={valorSeleccionado}
                onSelect={(val) => onSelectDocente(item.id, val)}
                disabled={guardandoEstaFila}
                placeholder="Seleccionar docente..."
                searchPlaceholder="Buscar docente por nombre o código..."
                emptyMessage="No se encontraron docentes activos."
                className="h-11 min-h-11 text-xs sm:text-sm"
              />
            </div>
          );
        }

        return (
          <div className="flex items-center gap-2">
            {item.docente ? (
              <>
                <HugeiconsIcon
                  icon={User02Icon}
                  className="text-muted-foreground size-4 shrink-0"
                />
                <span className="text-foreground text-sm font-medium">
                  {item.docente.nombreCompleto}
                </span>
                <span className="text-muted-foreground font-mono text-xs">
                  ({item.docente.codigo})
                </span>
              </>
            ) : (
              <span className="text-muted-foreground text-sm italic">Sin docente asignado</span>
            )}
          </div>
        );
      },
    },
  ];

  if (puedeGestionar) {
    columns.push({
      id: "actions",
      header: () => <div className="text-right">Acción</div>,
      cell: ({ row }) => {
        const item = row.original;
        const valorSeleccionado =
          docentesSeleccionados[item.id] !== undefined
            ? docentesSeleccionados[item.id]
            : (item.docente?.id ?? "");

        return (
          <div className="flex justify-end">
            <SeccionCargaActions
              cursoSeccionId={item.id}
              cursoNombre={item.cursoNombre}
              valorSeleccionado={valorSeleccionado}
              docenteOriginalId={item.docente?.id ?? ""}
              isSaving={guardandoFilaId === item.id}
              onGuardar={onGuardar}
            />
          </div>
        );
      },
    });
  }

  return columns;
}
