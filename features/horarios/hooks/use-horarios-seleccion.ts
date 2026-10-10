"use client";

import { useMemo, useState } from "react";
import type { Grado } from "@/features/grados";
import { useSeccionesPorGradoQuery } from "./use-horarios-query";

export function useHorariosSeleccion(grados: Grado[]) {
  const [gradoIdSeleccionado, setGradoIdSeleccionado] = useState<string | null>(null);
  const gradoId = useMemo(() => {
    if (gradoIdSeleccionado && grados.some((g) => g.id === gradoIdSeleccionado)) {
      return gradoIdSeleccionado;
    }
    return grados[0]?.id ?? null;
  }, [gradoIdSeleccionado, grados]);

  const [seccionIdSeleccionado, setSeccionIdSeleccionado] = useState<string | null>(null);

  const {
    data: seccionesDelGrado = [],
    isLoading: isLoadingSeccionesGrado,
    isError: isErrorSecciones,
  } = useSeccionesPorGradoQuery(gradoId);

  const seccionId = useMemo(() => {
    if (seccionIdSeleccionado && seccionesDelGrado.some((s) => s.id === seccionIdSeleccionado)) {
      return seccionIdSeleccionado;
    }
    return seccionesDelGrado[0]?.id ?? null;
  }, [seccionIdSeleccionado, seccionesDelGrado]);

  const seccionActual = useMemo(
    () => seccionesDelGrado.find((s) => s.id === seccionId),
    [seccionesDelGrado, seccionId],
  );

  const seccionesMismoGrado = useMemo(
    () => seccionesDelGrado.filter((s) => s.id !== seccionId),
    [seccionesDelGrado, seccionId],
  );

  const seleccionarGrado = (nuevoGradoId: string) => {
    setGradoIdSeleccionado(nuevoGradoId);
    setSeccionIdSeleccionado(null);
  };

  const seleccionarSeccion = (nuevaSeccionId: string) => {
    setSeccionIdSeleccionado(nuevaSeccionId);
  };

  return {
    gradoId,
    seccionesDelGrado,
    isLoadingSeccionesGrado,
    isErrorSecciones,
    seccionId,
    seccionActual,
    seccionesMismoGrado,
    seleccionarGrado,
    seleccionarSeccion,
  };
}
