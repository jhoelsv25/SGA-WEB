import { servicioMarcacion } from "../api";
import { BACKOFF_INICIAL_MS, BACKOFF_MAXIMO_MS, COLA_SIN_CONEXION_HABILITADA } from "../consts";
import type { EstadoColaMarcaciones } from "../types";
import {
  actualizarIntento,
  contarPendientes,
  estaDisponibleIndexedDB,
  listarPendientes,
  marcarEnviada,
} from "./almacen-indexeddb";

type SuscriptorEstado = (estado: EstadoColaMarcaciones) => void;

const suscriptores = new Set<SuscriptorEstado>();

let estaProcesando = false;
let backoffActualMs = BACKOFF_INICIAL_MS;

/**
 * Notifica a los suscriptores activos (hooks de React y componentes de UI)
 * sobre cualquier actualización en la cantidad de pendientes o estado de transmisión.
 */
async function notificarEstado(enviando: boolean, ultimoError?: string): Promise<void> {
  const disponible = estaDisponibleIndexedDB();
  const total = disponible ? await contarPendientes().catch(() => 0) : 0;

  const estado: EstadoColaMarcaciones = {
    totalPendientes: total,
    enviando,
    disponible,
    ultimoError,
  };

  suscriptores.forEach((suscriptor) => {
    try {
      suscriptor(estado);
    } catch {
      // Ignorar errores de suscriptores para no interrumpir el flujo
    }
  });
}

/**
 * Permite a componentes y hooks registrarse para recibir cambios en tiempo real
 * del estado de la cola y progreso de envíos.
 */
export function suscribirEstadoCola(suscriptor: SuscriptorEstado): () => void {
  suscriptores.add(suscriptor);
  return () => {
    suscriptores.delete(suscriptor);
  };
}

/**
 * Espera una cantidad dada de milisegundos respetando una señal de cancelación AbortSignal.
 */
function esperar(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise<void>((resolve) => {
    if (signal?.aborted) {
      resolve();
      return;
    }
    const timerId = setTimeout(() => {
      resolve();
    }, ms);

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timerId);
        resolve();
      },
      { once: true },
    );
  });
}

/**
 * Procesa la cola de marcaciones pendientes en estricto orden FIFO (uno a la vez).
 *
 * @remarks
 * Garantías de sincronización:
 * 1. Un solo envío a la vez (sin carreras): La variable 'estaProcesando' actúa como
 *    un cerrojo (mutex) atómico en memoria. Cualquier llamada concurrente retorna de inmediato.
 * 2. Orden FIFO: Se consultan las marcaciones ordenadas por fecha de registro en el dispositivo
 *    y se procesan secuencialmente.
 * 3. Clave de idempotencia: El UUID local 'idLocal' viaja como clave de idempotencia en la llamada
 *    a 'servicioMarcacion.registrarMarcacion' para evitar duplicaciones en el servidor.
 * 4. Espera creciente (backoff exponencial): Ante fallos de red o rechazos de transmisión,
 *    se aplica una espera escalonada (1 s, 2 s, 4 s... hasta 60 s) antes de reintentar.
 */
export async function procesarCola(signal?: AbortSignal): Promise<void> {
  if (!COLA_SIN_CONEXION_HABILITADA) {
    return;
  }

  // Prevenir carreras: solo un hilo de ejecución procesando la cola a la vez
  if (estaProcesando) {
    return;
  }

  // Verificar conexión real de red antes de procesar
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return;
  }

  if (!estaDisponibleIndexedDB()) {
    return;
  }

  estaProcesando = true;
  await notificarEstado(true);

  try {
    while (!signal?.aborted) {
      // Si la conexión se interrumpe durante el bucle, detener inmediatamente
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        break;
      }

      const pendientes = await listarPendientes();
      if (pendientes.length === 0) {
        // Cola completamente vaciada
        backoffActualMs = BACKOFF_INICIAL_MS;
        break;
      }

      // Estricto FIFO: procesar el registro más antiguo
      const siguiente = pendientes[0];

      try {
        await servicioMarcacion.registrarMarcacion({
          codigo: siguiente.codigo,
          tipo: siguiente.tipo,
          equipoId: siguiente.equipoId,
          idLocal: siguiente.idLocal, // Clave de idempotencia única
        });

        // Marcación aceptada en el servidor: retirar del almacén local
        await marcarEnviada(siguiente.idLocal);
        backoffActualMs = BACKOFF_INICIAL_MS;

        // Actualizar contadores y notificar a la UI
        await notificarEstado(true);
      } catch (error: unknown) {
        const mensajeError =
          error instanceof Error ? error.message : "Error desconocido al transmitir marcación";

        await actualizarIntento(siguiente.idLocal, mensajeError);
        await notificarEstado(false, mensajeError);

        // Espera creciente (backoff exponencial: 1s, 2s, 4s, 8s... hasta 60s)
        await esperar(backoffActualMs, signal);
        backoffActualMs = Math.min(BACKOFF_MAXIMO_MS, backoffActualMs * 2);

        // Tras un error, abortar este ciclo de vaciado; el próximo ciclo periódico
        // (cada 30s) o evento 'online' reanudará los envíos
        break;
      }
    }
  } finally {
    estaProcesando = false;
    await notificarEstado(false);
  }
}
