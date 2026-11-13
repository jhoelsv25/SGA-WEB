import { ApiClientError } from "@/lib/api-client";
import { TEXTO_NIVEL_PENDIENTE } from "../consts";
import type { Accion } from "../api";
import type { Observacion } from "../types";

/** Mensaje de una acción exitosa o el de respaldo. */
export function mensajeDe(resultado: unknown, porDefecto: string): string {
  if (resultado && typeof resultado === "object" && "mensaje" in resultado) {
    const mensaje = (resultado as Accion).mensaje;
    if (typeof mensaje === "string" && mensaje) return mensaje;
  }
  return porDefecto;
}

/** El 409 de cerrar notas pide confirmar una duración fuera de lo habitual. */
export function esConfirmacion(error: unknown): boolean {
  return error instanceof ApiClientError && error.statusCode === 409;
}

export function nombreDocente(obs: Pick<Observacion, "docenteNombre" | "docenteApellido">): string {
  return `${obs.docenteApellido}, ${obs.docenteNombre}`;
}

export function descripcionCurso(
  obs: Pick<Observacion, "cursoNombre" | "gradoNombre" | "seccionNombre">,
): string {
  return `${obs.cursoNombre} · ${obs.gradoNombre} ${obs.seccionNombre}`;
}

export const horaCorta = (hora: string | null | undefined): string =>
  hora ? hora.slice(0, 5) : "-";

/** La descripción de un nivel aún no cargada se muestra como pendiente, nunca se inventa. */
export function esTextoPendiente(descripcion: string | null | undefined): boolean {
  return !descripcion || descripcion.trim() === TEXTO_NIVEL_PENDIENTE;
}

/** Hora actual de la computadora en formato HH:MM, para precargar los campos de hora. */
export function horaActual(): string {
  const ahora = new Date();
  return `${String(ahora.getHours()).padStart(2, "0")}:${String(ahora.getMinutes()).padStart(2, "0")}`;
}

/** Fecha de hoy AAAA-MM-DD según la computadora. */
export function hoyIso(): string {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}
