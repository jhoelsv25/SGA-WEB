import { apiClient } from "@/lib/api-client";
import type { DatosRegistroMarcacion, ResultadoMarcacion, ResultadoResolucion } from "../types";
import type { EstadoMarcacion } from "../types";

/**
 * Error tipado emitido cuando el servicio de marcación no puede atender la petición.
 */
export class MarcacionNoDisponibleError extends Error {
  readonly codigo = "MARCACION_NO_DISPONIBLE";

  constructor(message = "Sin conexión. Avise a secretaría para registrar su marcación.") {
    super(message);
    this.name = "MarcacionNoDisponibleError";
  }
}

interface MarcacionKioskoApi {
  registrada: boolean;
  mensaje: string;
  nombreCompleto: string;
  fotoUrl: string | null;
  tipo?: "entrada" | "salida";
  resultado?: "puntual" | "tardanza" | "salida_anticipada" | "fuera_de_turno";
  minutosTardanza?: number;
  hora?: string;
}

const ESTADO_POR_RESULTADO: Record<
  NonNullable<MarcacionKioskoApi["resultado"]>,
  EstadoMarcacion
> = {
  puntual: "a_tiempo",
  tardanza: "tardanza",
  salida_anticipada: "salida_anticipada",
  fuera_de_turno: "fuera_de_horario",
};

/**
 * Contrato tipado del servicio de marcación para el terminal Kiosko.
 */
export interface ServicioMarcacion {
  /**
   * El servidor valida código y PIN en una sola llamada (para no revelar a quién
   * pertenece un código sin PIN). Siempre pide el PIN.
   */
  resolverCodigo(codigo: string): Promise<ResultadoResolucion>;

  /** Registra la marcación; el servidor decide si es entrada o salida con su propia hora. */
  registrarMarcacion(datos: DatosRegistroMarcacion): Promise<ResultadoMarcacion>;
}

export class ServicioMarcacionKiosko implements ServicioMarcacion {
  async resolverCodigo(_codigo: string): Promise<ResultadoResolucion> {
    return {
      persona: { nombre: "", rol: "" },
      tipoSugerido: "entrada",
      requierePin: true,
    };
  }

  async registrarMarcacion(datos: DatosRegistroMarcacion): Promise<ResultadoMarcacion> {
    const respuesta = await apiClient.post<MarcacionKioskoApi>(
      "/marcaciones/kiosko",
      { codigo: datos.codigo, pin: datos.pin ?? "" },
      { headers: datos.tokenEquipo ? { "x-kiosk-token": datos.tokenEquipo } : undefined },
    );
    const api = respuesta.data;
    const estado: EstadoMarcacion = !api.registrada
      ? "ya_marco"
      : ESTADO_POR_RESULTADO[api.resultado ?? "puntual"];
    return {
      persona: {
        nombre: api.nombreCompleto,
        rol: "",
        fotoUrl: api.fotoUrl ?? undefined,
      },
      tipo: api.tipo ?? datos.tipo,
      estado,
      hora: api.hora ?? "",
      mensaje: api.mensaje,
    };
  }
}

export const servicioMarcacion: ServicioMarcacion = new ServicioMarcacionKiosko();
