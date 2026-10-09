import { NOMBRE_ALMACEN_PENDIENTES, NOMBRE_BD_KIOSKO, VERSION_BD_KIOSKO } from "../consts";
import type { MarcacionPendiente, TipoMarcacion } from "../types";

/**
 * Verifica de forma segura si la API nativa de IndexedDB está disponible en el entorno actual.
 *
 * Devuelve false en caso de ejecución del lado del servidor (SSR), o si el navegador
 * bloquea el almacenamiento en modo de navegación privada o configuración restringida.
 */
export function estaDisponibleIndexedDB(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return (
      typeof window.indexedDB !== "undefined" &&
      window.indexedDB !== null &&
      typeof window.indexedDB.open === "function"
    );
  } catch {
    return false;
  }
}

/**
 * Abre una conexión a la base de datos IndexedDB local 'sga-kiosko'.
 *
 * Crea el almacén 'marcaciones-pendientes' con índice por fecha si no existe.
 */
export function abrirBaseDatos(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!estaDisponibleIndexedDB()) {
      reject(new Error("IndexedDB no está disponible en este entorno o sesión privada."));
      return;
    }

    try {
      const request = window.indexedDB.open(NOMBRE_BD_KIOSKO, VERSION_BD_KIOSKO);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(NOMBRE_ALMACEN_PENDIENTES)) {
          const store = db.createObjectStore(NOMBRE_ALMACEN_PENDIENTES, {
            keyPath: "idLocal",
          });
          store.createIndex("por_fecha", "marcadoEnDispositivo", { unique: false });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.onversionchange = () => {
          db.close();
        };
        resolve(db);
      };

      request.onerror = () => {
        reject(request.error ?? new Error("Error al abrir base de datos IndexedDB."));
      };

      request.onblocked = () => {
        reject(new Error("Apertura de base de datos IndexedDB bloqueada por otra pestaña."));
      };
    } catch (err: unknown) {
      reject(err instanceof Error ? err : new Error("Excepción al acceder a IndexedDB."));
    }
  });
}

/**
 * Guarda una nueva marcación en la cola local de pendientes.
 *
 * @remarks
 * Por privacidad y seguridad, este registro NUNCA almacena nombres de personas ni contraseñas/PIN.
 * Cada registro cuenta con un UUID local irrepetible que servirá como clave de idempotencia
 * en el envío al servidor del SGA.
 */
export async function encolar(datos: {
  codigo: string;
  tipo: TipoMarcacion;
  equipoId?: string;
}): Promise<MarcacionPendiente> {
  if (!estaDisponibleIndexedDB()) {
    throw new Error("IndexedDB no está disponible.");
  }

  const idLocal = crypto.randomUUID();
  const registro: MarcacionPendiente = {
    idLocal,
    codigo: datos.codigo,
    tipo: datos.tipo,
    marcadoEnDispositivo: new Date().toISOString(),
    intentos: 0,
    equipoId: datos.equipoId,
  };

  const db = await abrirBaseDatos();
  return new Promise<MarcacionPendiente>((resolve, reject) => {
    try {
      const tx = db.transaction(NOMBRE_ALMACEN_PENDIENTES, "readwrite");
      const store = tx.objectStore(NOMBRE_ALMACEN_PENDIENTES);
      const req = store.add(registro);

      req.onerror = () => {
        reject(req.error ?? new Error("Error al agregar marcación a la cola."));
      };

      tx.oncomplete = () => {
        db.close();
        resolve(registro);
      };

      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error("Error de transacción al guardar marcación."));
      };
    } catch (err: unknown) {
      db.close();
      reject(err instanceof Error ? err : new Error("Excepción al guardar marcación."));
    }
  });
}

/**
 * Obtiene todas las marcaciones pendientes en orden FIFO estricto
 * (de la más antigua a la más reciente según 'marcadoEnDispositivo').
 */
export async function listarPendientes(): Promise<MarcacionPendiente[]> {
  if (!estaDisponibleIndexedDB()) {
    return [];
  }

  const db = await abrirBaseDatos();
  return new Promise<MarcacionPendiente[]>((resolve, reject) => {
    try {
      const tx = db.transaction(NOMBRE_ALMACEN_PENDIENTES, "readonly");
      const store = tx.objectStore(NOMBRE_ALMACEN_PENDIENTES);
      const req = store.getAll();

      req.onsuccess = () => {
        const registros = (req.result as MarcacionPendiente[]) || [];
        // Orden FIFO estricto: la fecha de marcado más antigua primero
        registros.sort(
          (a, b) =>
            new Date(a.marcadoEnDispositivo).getTime() - new Date(b.marcadoEnDispositivo).getTime(),
        );
        resolve(registros);
      };

      req.onerror = () => {
        reject(req.error ?? new Error("Error al consultar marcaciones pendientes."));
      };

      tx.oncomplete = () => {
        db.close();
      };

      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error("Error de transacción al listar pendientes."));
      };
    } catch (err: unknown) {
      db.close();
      reject(err instanceof Error ? err : new Error("Excepción al listar pendientes."));
    }
  });
}

/**
 * Marca una marcación como completada y la elimina del almacén de pendientes.
 *
 * @param idLocal Identificador único de la marcación en el dispositivo.
 */
export async function marcarEnviada(idLocal: string): Promise<void> {
  if (!estaDisponibleIndexedDB()) {
    return;
  }

  const db = await abrirBaseDatos();
  return new Promise<void>((resolve, reject) => {
    try {
      const tx = db.transaction(NOMBRE_ALMACEN_PENDIENTES, "readwrite");
      const store = tx.objectStore(NOMBRE_ALMACEN_PENDIENTES);
      const req = store.delete(idLocal);

      req.onerror = () => {
        reject(req.error ?? new Error("Error al eliminar marcación enviada."));
      };

      tx.oncomplete = () => {
        db.close();
        resolve();
      };

      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error("Error de transacción al marcar enviada."));
      };
    } catch (err: unknown) {
      db.close();
      reject(err instanceof Error ? err : new Error("Excepción al marcar enviada."));
    }
  });
}

/**
 * Devuelve la cantidad actual de marcaciones pendientes en la cola.
 */
export async function contarPendientes(): Promise<number> {
  if (!estaDisponibleIndexedDB()) {
    return 0;
  }

  const db = await abrirBaseDatos();
  return new Promise<number>((resolve, reject) => {
    try {
      const tx = db.transaction(NOMBRE_ALMACEN_PENDIENTES, "readonly");
      const store = tx.objectStore(NOMBRE_ALMACEN_PENDIENTES);
      const req = store.count();

      req.onsuccess = () => {
        resolve(req.result ?? 0);
      };

      req.onerror = () => {
        reject(req.error ?? new Error("Error al contar pendientes en IndexedDB."));
      };

      tx.oncomplete = () => {
        db.close();
      };

      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error("Error de transacción al contar pendientes."));
      };
    } catch (err: unknown) {
      db.close();
      reject(err instanceof Error ? err : new Error("Excepción al contar pendientes."));
    }
  });
}

/**
 * Actualiza el contador de intentos y el último mensaje de error tras un intento fallido de retransmisión.
 *
 * @param idLocal Identificador de la marcación.
 * @param ultimoError Mensaje descriptivo del error de red o servidor ocurrido.
 */
export async function actualizarIntento(idLocal: string, ultimoError?: string): Promise<void> {
  if (!estaDisponibleIndexedDB()) {
    return;
  }

  const db = await abrirBaseDatos();
  return new Promise<void>((resolve, reject) => {
    try {
      const tx = db.transaction(NOMBRE_ALMACEN_PENDIENTES, "readwrite");
      const store = tx.objectStore(NOMBRE_ALMACEN_PENDIENTES);
      const getReq = store.get(idLocal);

      getReq.onsuccess = () => {
        const item = getReq.result as MarcacionPendiente | undefined;
        if (!item) {
          return;
        }
        item.intentos = (item.intentos || 0) + 1;
        if (ultimoError) {
          item.ultimoError = ultimoError;
        }
        store.put(item);
      };

      getReq.onerror = () => {
        reject(getReq.error ?? new Error("Error al obtener registro para actualizar intento."));
      };

      tx.oncomplete = () => {
        db.close();
        resolve();
      };

      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error("Error de transacción al actualizar intento."));
      };
    } catch (err: unknown) {
      db.close();
      reject(err instanceof Error ? err : new Error("Excepción al actualizar intento."));
    }
  });
}

/**
 * Vacía por completo el almacén de marcaciones pendientes.
 */
export async function limpiarCola(): Promise<void> {
  if (!estaDisponibleIndexedDB()) {
    return;
  }

  const db = await abrirBaseDatos();
  return new Promise<void>((resolve, reject) => {
    try {
      const tx = db.transaction(NOMBRE_ALMACEN_PENDIENTES, "readwrite");
      const store = tx.objectStore(NOMBRE_ALMACEN_PENDIENTES);
      store.clear();

      tx.oncomplete = () => {
        db.close();
        resolve();
      };

      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error("Error al limpiar almacén IndexedDB."));
      };
    } catch (err: unknown) {
      db.close();
      reject(err instanceof Error ? err : new Error("Excepción al limpiar almacén."));
    }
  });
}
