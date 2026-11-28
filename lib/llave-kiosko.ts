/**
 * Llave del navegador de un kiosko (ECDSA P-256). La privada se crea como no exportable y se guarda
 * en IndexedDB: puede firmar, pero no se puede leer ni copiar a otro navegador desde la página.
 */
const BASE_DATOS = "sga-kiosko-llave";
const ALMACEN = "llave";
const REGISTRO = "actual";
/** Claves de texto de la versión anterior: ya no sirven y se eliminan. */
const CLAVES_ANTIGUAS = ["sga_kiosk_token", "sga_kiosk_secreto"];

interface LlaveGuardada {
  privada: CryptoKey;
  publica: string;
}

export class LlaveKioskoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LlaveKioskoError";
  }
}

let enMemoria: Promise<LlaveGuardada> | null = null;

function aBase64Url(datos: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(datos)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function aHex(datos: ArrayBuffer | Uint8Array): string {
  return Array.from(new Uint8Array(datos), (b) => b.toString(16).padStart(2, "0")).join("");
}

function esperar<T>(pedido: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    pedido.onsuccess = () => resolve(pedido.result);
    pedido.onerror = () => reject(pedido.error);
  });
}

async function abrirAlmacen(): Promise<IDBDatabase> {
  const pedido = indexedDB.open(BASE_DATOS, 1);
  pedido.onupgradeneeded = () => pedido.result.createObjectStore(ALMACEN);
  return esperar(pedido);
}

async function cargarOCrear(): Promise<LlaveGuardada> {
  if (!globalThis.crypto?.subtle || !globalThis.indexedDB) {
    throw new LlaveKioskoError(
      "Este navegador no puede proteger la llave del kiosko. Abra la página con HTTPS.",
    );
  }
  const db = await abrirAlmacen();
  try {
    const leer = () =>
      esperar<LlaveGuardada | undefined>(
        db.transaction(ALMACEN).objectStore(ALMACEN).get(REGISTRO),
      );
    const guardada = await leer();
    if (guardada) return guardada;

    const par = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, [
      "sign",
      "verify",
    ]);
    const publica = aBase64Url(await crypto.subtle.exportKey("raw", par.publicKey));
    try {
      await esperar(
        db
          .transaction(ALMACEN, "readwrite")
          .objectStore(ALMACEN)
          .add({ privada: par.privateKey, publica }, REGISTRO),
      );
    } catch (error) {
      // Otra pestaña la creó primero: se usa la suya
      const otra = await leer();
      if (otra) return otra;
      throw error;
    }
    for (const clave of CLAVES_ANTIGUAS) localStorage.removeItem(clave);
    return { privada: par.privateKey, publica };
  } finally {
    db.close();
  }
}

function obtenerLlave(): Promise<LlaveGuardada> {
  enMemoria ??= cargarOCrear().catch((error: unknown) => {
    enMemoria = null;
    throw error;
  });
  return enMemoria;
}

/** Identificador público del navegador: es lo que aprueba Soporte TI. */
export async function obtenerLlavePublicaKiosko(): Promise<string> {
  return (await obtenerLlave()).publica;
}

/**
 * Cabeceras firmadas para un pedido del kiosko. Sirven una sola vez.
 * `ruta` y `cuerpo` deben ser exactamente los que se envían.
 * El texto firmado coincide con SGA-API/src/features/equipos/utils/firma-kiosko.util.ts.
 */
export async function firmarPeticionKiosko(
  metodo: "GET" | "POST",
  ruta: string,
  cuerpo?: object,
): Promise<{ headers: Record<string, string> }> {
  const { privada, publica } = await obtenerLlave();
  const codificar = (texto: string) => new TextEncoder().encode(texto);
  const fecha = String(Date.now());
  const nonce = aHex(crypto.getRandomValues(new Uint8Array(16)));
  const huellaCuerpo = aHex(
    await crypto.subtle.digest("SHA-256", codificar(cuerpo ? JSON.stringify(cuerpo) : "")),
  );
  const firma = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privada,
    codificar([metodo, ruta, fecha, nonce, huellaCuerpo].join("\n")),
  );
  return {
    headers: {
      "x-kiosk-key": publica,
      "x-kiosk-timestamp": fecha,
      "x-kiosk-nonce": nonce,
      "x-kiosk-signature": aBase64Url(firma),
    },
  };
}
