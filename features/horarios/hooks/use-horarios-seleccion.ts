"use client";

import { useCallback, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Grado } from "@/features/grados";
import { useSeccionesPorGradoQuery } from "./use-horarios-query";

const PARAM_GRADO = "grado";
const PARAM_SECCION = "seccion";
const PARAM_DOCENTE = "docente";

export function useHorariosSeleccion(grados: Grado[], isLoadingGrados = false) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const gradoParam = searchParams.get(PARAM_GRADO);
  const seccionParam = searchParams.get(PARAM_SECCION);
  const docenteFiltroId = searchParams.get(PARAM_DOCENTE) || null;

  const actualizarUrl = useCallback(
    (cambios: { grado?: string | null; seccion?: string | null; docente?: string | null }) => {
      const params = new URLSearchParams(searchParams.toString());

      if ("grado" in cambios) {
        if (cambios.grado) params.set(PARAM_GRADO, cambios.grado);
        else params.delete(PARAM_GRADO);
      }
      if ("seccion" in cambios) {
        if (cambios.seccion) params.set(PARAM_SECCION, cambios.seccion);
        else params.delete(PARAM_SECCION);
      }
      if ("docente" in cambios) {
        if (cambios.docente) params.set(PARAM_DOCENTE, cambios.docente);
        else params.delete(PARAM_DOCENTE);
      }

      const nextQs = params.toString();
      const currentQs = searchParams.toString();
      if (nextQs === currentQs) return;

      router.replace(nextQs ? `${pathname}?${nextQs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const gradoId = useMemo(() => {
    if (grados.length === 0) {
      // Mientras cargan los grados, conservar el de la URL para consultar secciones en paralelo
      return isLoadingGrados ? gradoParam || null : null;
    }
    if (gradoParam && grados.some((g) => g.id === gradoParam)) {
      return gradoParam;
    }
    return grados[0]?.id ?? null;
  }, [gradoParam, grados, isLoadingGrados]);

  const {
    data: seccionesDelGrado = [],
    isLoading: isLoadingSeccionesGrado,
    isError: isErrorSecciones,
  } = useSeccionesPorGradoQuery(gradoId);

  const seccionId = useMemo(() => {
    if (isLoadingSeccionesGrado) {
      // Mientras cargan las secciones, disparar horario y carga en paralelo si coincide el grado
      if (seccionParam && (!gradoParam || gradoParam === gradoId)) {
        return seccionParam;
      }
      return null;
    }
    if (seccionParam && seccionesDelGrado.some((s) => s.id === seccionParam)) {
      return seccionParam;
    }
    return seccionesDelGrado[0]?.id ?? null;
  }, [gradoId, gradoParam, isLoadingSeccionesGrado, seccionParam, seccionesDelGrado]);

  useEffect(() => {
    if (isLoadingGrados || !gradoId) return;

    if (isLoadingSeccionesGrado) {
      if ((gradoParam || null) !== gradoId) {
        actualizarUrl({ grado: gradoId, seccion: null, docente: null });
      }
      return;
    }

    const gradoCambio = (gradoParam || null) !== gradoId;
    const seccionCambio = (seccionParam || null) !== seccionId;
    if (!gradoCambio && !seccionCambio) return;

    actualizarUrl({
      grado: gradoId,
      seccion: seccionId,
      ...(seccionCambio ? { docente: null } : {}),
    });
  }, [
    actualizarUrl,
    gradoId,
    gradoParam,
    isLoadingGrados,
    isLoadingSeccionesGrado,
    seccionId,
    seccionParam,
  ]);

  const seccionActual = useMemo(
    () => seccionesDelGrado.find((s) => s.id === seccionId),
    [seccionesDelGrado, seccionId],
  );

  const seccionesMismoGrado = useMemo(
    () => seccionesDelGrado.filter((s) => s.id !== seccionId),
    [seccionesDelGrado, seccionId],
  );

  const seleccionarGrado = useCallback(
    (nuevoGradoId: string) => {
      actualizarUrl({ grado: nuevoGradoId, seccion: null, docente: null });
    },
    [actualizarUrl],
  );

  const seleccionarSeccion = useCallback(
    (nuevaSeccionId: string) => {
      actualizarUrl({ grado: gradoId, seccion: nuevaSeccionId, docente: null });
    },
    [actualizarUrl, gradoId],
  );

  const seleccionarDocente = useCallback(
    (nuevoDocenteId: string | null) => {
      actualizarUrl({ docente: nuevoDocenteId || null });
    },
    [actualizarUrl],
  );

  return {
    gradoId,
    seccionesDelGrado,
    isLoadingSeccionesGrado,
    isErrorSecciones,
    seccionId,
    seccionActual,
    seccionesMismoGrado,
    docenteFiltroId,
    seleccionarGrado,
    seleccionarSeccion,
    seleccionarDocente,
  };
}
