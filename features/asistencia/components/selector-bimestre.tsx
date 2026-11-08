"use client";

import * as React from "react";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { cn } from "@/lib/utils";
import type { RangoFechas } from "../types";

/** Rango del bimestre elegido; por defecto, el que está en curso o el primero. */
export function useRangoBimestre() {
  const { anio } = useAnioLectivo();
  const bimestres = React.useMemo(() => anio?.bimestres ?? [], [anio]);
  const [elegido, setElegido] = React.useState<string | null>(null);

  const actual =
    bimestres.find((b) => b.id === elegido) ??
    bimestres.find((b) => b.estado === "en_curso") ??
    bimestres[0];

  const rango: RangoFechas | undefined = actual
    ? { desde: actual.fechaInicio.slice(0, 10), hasta: actual.fechaFin.slice(0, 10) }
    : undefined;

  return { bimestres, bimestreId: actual?.id ?? "", setElegido, rango };
}

interface SelectorBimestreProps {
  bimestres: { id: string; nombre: string; estado?: string }[];
  valor: string;
  onCambiar: (id: string) => void;
  className?: string;
}

export function SelectorBimestre({
  bimestres,
  valor,
  onCambiar,
  className,
}: SelectorBimestreProps) {
  if (bimestres.length === 0) return null;

  return (
    <div
      role="tablist"
      aria-label="Seleccionar periodo o bimestre escolar"
      className={cn(
        "bg-muted/70 border-border/60 inline-flex flex-wrap items-center gap-1 rounded-xl border p-1 shadow-inner",
        className,
      )}
    >
      {bimestres.map((b) => {
        const activo = b.id === valor;
        const enCurso = b.estado === "en_curso";
        const etiqueta = b.nombre.includes("Bimestre") ? b.nombre : `${b.nombre} Bimestre`;
        return (
          <button
            key={b.id}
            type="button"
            role="tab"
            aria-selected={activo}
            onClick={() => onCambiar(b.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all select-none",
              activo
                ? "bg-card text-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:bg-card/40 hover:text-foreground",
            )}
          >
            <span>{etiqueta}</span>
            {enCurso && (
              <span
                className="flex size-1.5 animate-pulse rounded-full bg-emerald-500"
                title="Bimestre escolar en curso"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
