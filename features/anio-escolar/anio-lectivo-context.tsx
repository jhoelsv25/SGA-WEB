"use client";

import * as React from "react";
import { fijarAnioLectivoActivo } from "./anio-lectivo-activo";
import { useAnioVigenteQuery, useAniosQuery, useEsAdministrador } from "./hooks/use-anios-query";
import { anioDeReferencia, sePuedeElegir } from "./seleccion-anio";
import type { AnioAcademico } from "./types";

const CLAVE_ANIO = "sga:anio-lectivo:v1";

interface AnioGuardado {
  listo: boolean;
  id: string | null;
}

const ANIO_SIN_LEER: AnioGuardado = { listo: false, id: null };

let anioActual: AnioGuardado = ANIO_SIN_LEER;
let lecturaPendiente = false;
const oyentes = new Set<() => void>();

function leerId(): string | null {
  try {
    return localStorage.getItem(CLAVE_ANIO);
  } catch {
    return null;
  }
}

function escribirId(id: string | null) {
  try {
    if (id) localStorage.setItem(CLAVE_ANIO, id);
    else localStorage.removeItem(CLAVE_ANIO);
  } catch {
    // El navegador puede bloquear el almacenamiento.
  }
}

function publicar(id: string | null) {
  anioActual = { listo: true, id };
  escribirId(id);
  for (const oyente of oyentes) oyente();
}

function suscribirAnio(oyente: () => void) {
  oyentes.add(oyente);
  const alCambiarEnOtraPestana = (event: StorageEvent) => {
    if (event.key !== CLAVE_ANIO && event.key !== null) return;
    anioActual = { listo: true, id: leerId() };
    oyente();
  };
  window.addEventListener("storage", alCambiarEnOtraPestana);
  return () => {
    oyentes.delete(oyente);
    window.removeEventListener("storage", alCambiarEnOtraPestana);
  };
}

function anioGuardado(): AnioGuardado {
  if (typeof window !== "undefined" && !anioActual.listo && !lecturaPendiente) {
    lecturaPendiente = true;
    queueMicrotask(() => {
      anioActual = { listo: true, id: leerId() };
      for (const oyente of oyentes) oyente();
    });
  }
  return anioActual;
}

interface AnioLectivoContextValue {
  anio: AnioAcademico | null;
  anios: AnioAcademico[];
  cargando: boolean;
  seleccionar: (id: string) => void;
}

const AnioLectivoContext = React.createContext<AnioLectivoContextValue | null>(null);

export function AnioLectivoProvider({ children }: { children: React.ReactNode }) {
  const esAdmin = useEsAdministrador();
  const lista = useAniosQuery(esAdmin);
  const vigenteQuery = useAnioVigenteQuery();
  const guardado = React.useSyncExternalStore(suscribirAnio, anioGuardado, () => ANIO_SIN_LEER);

  const anios = React.useMemo(() => {
    const desdeLista = [...(lista.data ?? [])].sort((a, b) => b.anio - a.anio);
    if (desdeLista.length > 0) return desdeLista;
    return vigenteQuery.data ? [vigenteQuery.data] : [];
  }, [lista.data, vigenteQuery.data]);

  const referencia = anioDeReferencia(anios);
  const elegido = anios.find((anio) => anio.id === guardado.id);
  const anio = elegido && sePuedeElegir(elegido, referencia) ? elegido : (referencia ?? null);

  const seleccionar = React.useCallback(
    (id: string) => {
      const siguiente = anios.find((item) => item.id === id);
      if (!siguiente || !sePuedeElegir(siguiente, referencia)) return;
      publicar(referencia && siguiente.id === referencia.id ? null : siguiente.id);
    },
    [anios, referencia],
  );

  const cargando =
    !guardado.listo || (anios.length === 0 && (lista.isLoading || vigenteQuery.isLoading));

  if (!cargando) fijarAnioLectivoActivo(anio?.id ?? null);

  const value = React.useMemo(
    () => ({ anio: cargando ? null : anio, anios, cargando, seleccionar }),
    [anio, anios, cargando, seleccionar],
  );

  return <AnioLectivoContext.Provider value={value}>{children}</AnioLectivoContext.Provider>;
}

export function useAnioLectivo(): AnioLectivoContextValue {
  const value = React.useContext(AnioLectivoContext);
  if (!value) {
    throw new Error("useAnioLectivo debe usarse dentro de AnioLectivoProvider.");
  }
  return value;
}
