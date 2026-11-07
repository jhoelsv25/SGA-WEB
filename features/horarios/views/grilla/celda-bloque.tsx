"use client";

import { Edit01Icon, Delete02Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import type { BloqueHorario } from "../../types";
import { getContrasteColor, formatearRangoHora, convertirHoraAMinutos } from "../../utils";

interface CeldaBloqueProps {
  bloque: BloqueHorario;
  duracionBaseClase?: number;
  puedeGestionar: boolean;
  span?: number;
  onEditar: (bloque: BloqueHorario) => void;
  onEliminar: (bloque: BloqueHorario) => void;
}

// Altura base en píxeles por cada slot de 15 minutos en la grilla
const ALTURA_SLOT_PX = 34;

export function CeldaBloque({
  bloque,
  duracionBaseClase,
  puedeGestionar,
  span,
  onEditar,
  onEliminar,
}: CeldaBloqueProps) {
  const esReceso = bloque.tipoBloque === "receso";
  const duracionMinutos =
    convertirHoraAMinutos(bloque.horaFin) - convertirHoraAMinutos(bloque.horaInicio);

  // Un bloque de clase es doble si dura más que el bloque de clase más corto de referencia
  const esBloqueDoble =
    !esReceso &&
    duracionBaseClase !== undefined &&
    duracionBaseClase > 0 &&
    duracionMinutos > duracionBaseClase;

  const alturaCalculada = span && span > 1 ? span * ALTURA_SLOT_PX - 8 : undefined;

  if (esReceso) {
    const esRecesoCorto = !span || span === 1;

    return (
      <div
        className="group relative flex h-full min-h-7 flex-col justify-between rounded-lg border border-amber-500/40 bg-amber-500/10 p-1.5 text-xs transition-colors hover:bg-amber-500/15"
        style={{
          minHeight: alturaCalculada ? `${alturaCalculada}px` : undefined,
        }}
      >
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 font-bold text-amber-800 dark:text-amber-300">
            <HugeiconsIcon
              icon={Clock01Icon}
              className="size-3 shrink-0 text-amber-600 dark:text-amber-400"
            />
            <span className="truncate">{esRecesoCorto ? "Receso" : "Receso escolar"}</span>
          </div>
          <span className="font-mono text-[10px] font-semibold text-amber-800/80 dark:text-amber-300/80">
            {formatearRangoHora(bloque.horaInicio, bloque.horaFin)}
          </span>

          {esRecesoCorto && puedeGestionar && (
            <div className="flex items-center gap-0.5 opacity-80 transition-opacity group-hover:opacity-100">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onEditar(bloque)}
                className="size-6 rounded text-amber-700 hover:bg-amber-500/20 hover:text-amber-900 dark:text-amber-300"
                aria-label="Editar receso escolar"
              >
                <HugeiconsIcon icon={Edit01Icon} className="size-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onEliminar(bloque)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive size-6 rounded"
                aria-label="Eliminar receso escolar"
              >
                <HugeiconsIcon icon={Delete02Icon} className="size-3" />
              </Button>
            </div>
          )}
        </div>

        {!esRecesoCorto && puedeGestionar && (
          <div className="mt-1 flex items-center justify-end gap-1 opacity-90 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEditar(bloque)}
              className="size-6 rounded-md text-amber-700 hover:bg-amber-500/20 hover:text-amber-900 dark:text-amber-300"
              aria-label="Editar receso escolar"
            >
              <HugeiconsIcon icon={Edit01Icon} className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEliminar(bloque)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive size-6 rounded-md"
              aria-label="Eliminar receso escolar"
            >
              <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  const contraste = getContrasteColor(bloque.colorHex);

  return (
    <div
      className="group relative flex h-full min-h-16 flex-col justify-between rounded-lg p-2.5 shadow-xs transition-shadow hover:shadow-md"
      style={{
        backgroundColor: contraste.backgroundColor,
        color: contraste.color,
        border: contraste.borderColor ? `1px solid ${contraste.borderColor}` : undefined,
        minHeight: alturaCalculada ? `${alturaCalculada}px` : undefined,
      }}
    >
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-1">
          <p className="leading-tight font-bold tracking-tight">
            {bloque.cursoNombre ?? "Curso sin nombre"}
          </p>
          {esBloqueDoble && (
            <span
              className="inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                color: contraste.color,
              }}
            >
              Bloque doble
            </span>
          )}
        </div>

        <p className="text-[11px] opacity-90">
          {bloque.docenteNombre ? bloque.docenteNombre : "Docente no asignado"}
        </p>

        {bloque.aula && (
          <p className="text-[10px] opacity-80">
            Aula: <span className="font-medium">{bloque.aula}</span>
          </p>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-1.5 text-[11px] dark:border-white/10">
        <span className="font-mono font-medium opacity-90">
          {formatearRangoHora(bloque.horaInicio, bloque.horaFin)}
        </span>

        {puedeGestionar && (
          <div className="flex items-center gap-1 opacity-90 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEditar(bloque)}
              className="size-7 rounded-md hover:bg-black/15 hover:text-inherit dark:hover:bg-white/20"
              style={{ color: contraste.color }}
              aria-label={`Editar bloque de ${bloque.cursoNombre}`}
            >
              <HugeiconsIcon icon={Edit01Icon} className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEliminar(bloque)}
              className="size-7 rounded-md hover:bg-black/15 hover:text-inherit dark:hover:bg-white/20"
              style={{ color: contraste.color }}
              aria-label={`Eliminar bloque de ${bloque.cursoNombre}`}
            >
              <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
