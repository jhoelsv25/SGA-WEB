"use client";

import * as React from "react";
import { COLA_SIN_CONEXION_HABILITADA, INTERVALO_REVISION_COLA_MS } from "../consts";
import type { MarcacionPendiente, TipoMarcacion } from "../types";
import { contarPendientes, encolar, estaDisponibleIndexedDB } from "./almacen-indexeddb";
import { procesarCola, suscribirEstadoCola } from "./gestor-cola";

export interface UseColaMarcacionesReturn {
  totalPendientes: number;
  enviandoCola: boolean;
  indexedDbDisponible: boolean;
  colaHabilitada: boolean;
  encolarMarcacion: (datos: {
    codigo: string;
    tipo: TipoMarcacion;
    equipoId?: string;
  }) => Promise<MarcacionPendiente | null>;
  forzarSincronizacion: () => Promise<void>;
}

/**
 * Hook de React para conectar la vista del Kiosko con la cola local de marcaciones sin conexión.
 *
 * @param estaEnLinea Estado de conectividad de red actual del navegador.
 *
 * @remarks
 * Administra el ciclo de vida de los listeners de red 'online', el intervalo periódico de 30 segundos
 * para reintentos y la suscripción a cambios en IndexedDB, asegurando una limpieza rigurosa (cleanups)
 * de todos los timers y controladores de cancelación para evitar fugas de memoria.
 */
export function useColaMarcaciones(estaEnLinea: boolean): UseColaMarcacionesReturn {
  const [totalPendientes, setTotalPendientes] = React.useState<number>(0);
  const [enviandoCola, setEnviandoCola] = React.useState<boolean>(false);
  const [indexedDbDisponible, setIndexedDbDisponible] = React.useState<boolean>(() =>
    estaDisponibleIndexedDB(),
  );

  // Inicialización y suscripción a eventos de la cola en memoria e IndexedDB
  React.useEffect(() => {
    if (!COLA_SIN_CONEXION_HABILITADA || !estaDisponibleIndexedDB()) {
      return;
    }

    let cancelado = false;

    // Cargar conteo inicial de marcaciones guardadas
    void contarPendientes()
      .then((conteo) => {
        if (!cancelado) {
          setTotalPendientes(conteo);
        }
      })
      .catch(() => {
        if (!cancelado) {
          setIndexedDbDisponible(false);
        }
      });

    // Suscribirse a actualizaciones del procesador de cola
    const desuscribir = suscribirEstadoCola((estado) => {
      if (!cancelado) {
        setTotalPendientes(estado.totalPendientes);
        setEnviandoCola(estado.enviando);
      }
    });

    return () => {
      cancelado = true;
      desuscribir();
    };
  }, []);

  // Programación de sincronización: al volver a estar 'online' y cada 30 segundos mientras haya pendientes
  React.useEffect(() => {
    if (!COLA_SIN_CONEXION_HABILITADA || !indexedDbDisponible) {
      return;
    }

    const abortController = new AbortController();

    // Evento de retorno de conectividad a internet
    const handleOnline = () => {
      void procesarCola(abortController.signal);
    };

    window.addEventListener("online", handleOnline);

    // Si ya hay conectividad y tenemos registros pendientes en espera
    if (estaEnLinea && totalPendientes > 0) {
      void procesarCola(abortController.signal);
    }

    // Intervalo de revisión cada 30 segundos mientras haya pendientes
    let intervaloId: ReturnType<typeof setInterval> | null = null;
    if (estaEnLinea && totalPendientes > 0) {
      intervaloId = setInterval(() => {
        void procesarCola(abortController.signal);
      }, INTERVALO_REVISION_COLA_MS);
    }

    return () => {
      abortController.abort();
      window.removeEventListener("online", handleOnline);
      if (intervaloId) {
        clearInterval(intervaloId);
      }
    };
  }, [estaEnLinea, totalPendientes, indexedDbDisponible]);

  const encolarMarcacion = React.useCallback(
    async (datos: {
      codigo: string;
      tipo: TipoMarcacion;
      equipoId?: string;
    }): Promise<MarcacionPendiente | null> => {
      if (!COLA_SIN_CONEXION_HABILITADA || !indexedDbDisponible) {
        return null;
      }

      try {
        const registro = await encolar(datos);
        const conteoActual = await contarPendientes();
        setTotalPendientes(conteoActual);

        // Si hay conexión de red disponible en este momento, activar el envío
        if (estaEnLinea) {
          void procesarCola();
        }

        return registro;
      } catch {
        return null;
      }
    },
    [estaEnLinea, indexedDbDisponible],
  );

  const forzarSincronizacion = React.useCallback(async () => {
    if (!COLA_SIN_CONEXION_HABILITADA || !estaEnLinea) {
      return;
    }
    await procesarCola();
  }, [estaEnLinea]);

  return {
    totalPendientes,
    enviandoCola,
    indexedDbDisponible,
    colaHabilitada: COLA_SIN_CONEXION_HABILITADA,
    encolarMarcacion,
    forzarSincronizacion,
  };
}
