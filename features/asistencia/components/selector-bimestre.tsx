"use client";

import * as React from "react";
import { SelectOption } from "@/components/common/select";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
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
  bimestres: { id: string; nombre: string }[];
  valor: string;
  onCambiar: (id: string) => void;
}

export function SelectorBimestre({ bimestres, valor, onCambiar }: SelectorBimestreProps) {
  return (
    <div className="w-full max-w-56">
      <SelectOption
        options={bimestres.map((b) => ({ value: b.id, label: b.nombre }))}
        value={valor}
        onSelect={onCambiar}
        placeholder="Bimestre"
      />
    </div>
  );
}
