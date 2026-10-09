"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { SelectOption } from "@/components/common/select";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { useEsAdministrador } from "@/features/anio-escolar/hooks";
import { anioDeReferencia, sePuedeElegir } from "@/features/anio-escolar/seleccion-anio";
import { formatoFecha } from "@/features/anio-escolar/utils";
import type { AnioAcademico, EstadoAnio } from "@/features/anio-escolar/types";

const DETALLE_ANIO: Record<EstadoAnio, string> = {
  en_curso: "Periodo escolar en curso",
  reabierto: "Reabierto",
  planificado: "Aún no inicia. No se puede elegir.",
  cerrado: "Año anterior, concluido",
};

const ORDEN_GRUPO = ["En curso", "Anteriores", "No disponibles"] as const;

function detalleDeAnio(anio: AnioAcademico): string {
  if (anio.estado === "reabierto" && anio.reabiertoHasta) {
    return `Reabierto hasta ${formatoFecha(anio.reabiertoHasta)}`;
  }
  return DETALLE_ANIO[anio.estado];
}

function grupoDe(anio: AnioAcademico, referencia?: AnioAcademico): (typeof ORDEN_GRUPO)[number] {
  if (anio.estado === "en_curso" || anio.estado === "reabierto") return "En curso";
  if (sePuedeElegir(anio, referencia)) return "Anteriores";
  return "No disponibles";
}

function descripcionDeOpcion(anio: AnioAcademico, referencia?: AnioAcademico): string {
  if (sePuedeElegir(anio, referencia)) return detalleDeAnio(anio);
  if (anio.estado === "planificado") return DETALLE_ANIO.planificado;
  return "Es posterior al año en curso.";
}

function ChipAnioLectivo({
  children,
  ariaLabel,
}: {
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className="border-border/60 bg-muted/40 text-foreground/90 flex h-11 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold sm:h-auto sm:min-h-8 sm:py-1"
    >
      <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-3.5 shrink-0" />
      {children}
    </div>
  );
}

function ResumenAnio({ anio }: { anio: AnioAcademico }) {
  return (
    <>
      <span className="text-xs font-semibold sm:hidden">{anio.anio}</span>
      <div className="hidden flex-col text-left sm:flex">
        <span className="text-xs font-semibold">Año académico {anio.anio}</span>
        <span className="text-muted-foreground text-xs font-normal">{detalleDeAnio(anio)}</span>
      </div>
    </>
  );
}

export function HeaderAcademicYearSelect() {
  const esAdmin = useEsAdministrador();
  const { anio, anios, cargando, seleccionar } = useAnioLectivo();
  const referencia = anioDeReferencia(anios);
  const opciones = React.useMemo(
    () =>
      [...anios]
        .sort((a, b) => {
          const grupo =
            ORDEN_GRUPO.indexOf(grupoDe(a, referencia)) -
            ORDEN_GRUPO.indexOf(grupoDe(b, referencia));
          if (grupo !== 0) return grupo;
          return b.anio - a.anio;
        })
        .map((item) => ({
          value: item.id,
          label: `Año académico ${item.anio}`,
          description: descripcionDeOpcion(item, referencia),
          disabled: !sePuedeElegir(item, referencia),
          group: grupoDe(item, referencia),
          icon: <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-3.5" />,
        })),
    [anios, referencia],
  );

  if (cargando) {
    return (
      <ChipAnioLectivo ariaLabel="Cargando año académico">
        <span className="text-xs font-semibold sm:hidden">…</span>
        <span className="hidden text-xs font-semibold sm:inline">Cargando año…</span>
      </ChipAnioLectivo>
    );
  }

  if (!esAdmin) {
    if (!anio) {
      return (
        <ChipAnioLectivo ariaLabel="Sin año académico">
          <span className="text-xs font-semibold sm:hidden">Sin año</span>
          <span className="hidden text-xs font-semibold sm:inline">Sin año académico</span>
        </ChipAnioLectivo>
      );
    }
    return (
      <ChipAnioLectivo ariaLabel={`Año académico ${anio.anio}`}>
        <ResumenAnio anio={anio} />
      </ChipAnioLectivo>
    );
  }

  return (
    <SelectOption
      options={opciones}
      value={anio?.id}
      onSelect={seleccionar}
      placeholder="Sin año en curso"
      searchPlaceholder="Buscar año académico..."
      emptyMessage="No hay años académicos."
      className="border-border/60 bg-muted/40 hover:bg-muted/70 h-11 min-h-11 w-auto max-w-36 min-w-28 shrink rounded-lg px-2 py-1 text-xs font-semibold shadow-none sm:h-auto sm:min-h-8 sm:max-w-64 sm:min-w-44 sm:px-2.5 [&_span>span.text-muted-foreground]:hidden sm:[&_span>span.text-muted-foreground]:block"
    />
  );
}
