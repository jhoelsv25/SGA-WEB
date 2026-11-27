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
      className="border-primary bg-primary text-primary-foreground flex h-11 items-center gap-1.5 rounded-2xl border px-2.5 text-xs font-semibold sm:h-auto sm:min-h-8 sm:py-1"
    >
      <HugeiconsIcon icon={Calendar03Icon} className="size-3.5 shrink-0" />
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
        <span className="text-xs font-normal opacity-85">{detalleDeAnio(anio)}</span>
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
      // En color primario sólido: es el contexto de todo lo que se ve y debe notarse.
      className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground hover:border-primary dark:border-primary dark:bg-primary dark:hover:bg-primary/90 aria-expanded:bg-primary aria-expanded:text-primary-foreground dark:aria-expanded:bg-primary [&_span.text-muted-foreground]:text-primary-foreground/85 [&_svg]:text-primary-foreground h-11 min-h-11 w-auto max-w-44 min-w-28 shrink rounded-2xl px-2 py-1 text-xs font-semibold shadow-none sm:h-auto sm:min-h-8 sm:max-w-64 sm:min-w-44 sm:px-2.5 [&_span>span.text-muted-foreground]:hidden sm:[&_span>span.text-muted-foreground]:block [&_svg]:opacity-100"
    />
  );
}
