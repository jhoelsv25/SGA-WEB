import type { Sesion } from "../types";

/**
 * Extrae el mensaje de respuesta de una mutación de sesión o devuelve el valor por defecto.
 */
export function extraerMensajeSesion(resultado: unknown, porDefecto: string): string {
  if (resultado && typeof resultado === "object" && "mensaje" in resultado) {
    return String((resultado as { mensaje: unknown }).mensaje);
  }
  return porDefecto;
}

/** Convierte "HH:mm" a minutos desde la medianoche. */
export function minutosDeHora(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((n) => Number.parseInt(n, 10));
  return (Number.isNaN(h) ? 0 : h) * 60 + (Number.isNaN(m) ? 0 : m);
}

/** Devuelve la hora actual en Lima ("HH:mm") y su equivalente en minutos del día. */
export function horaActualLima(): { hhmm: string; minutos: number } {
  const texto = new Intl.DateTimeFormat("es-PE", {
    timeZone: "America/Lima",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
  return { hhmm: texto, minutos: minutosDeHora(texto) };
}

/** Formatea minutos desde la medianoche como "HH:mm". */
export function horaDesdeMinutos(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Evalúa si una sesión está antes, dentro o después de la ventana de firma. */
export function evaluarVentanaCliente(
  sesion: Sesion,
  minutosActuales: number,
  minutosAntes: number,
): "antes" | "ok" | "despues" {
  const inicio = minutosDeHora(sesion.horaInicio);
  const fin = minutosDeHora(sesion.horaFin);
  if (minutosActuales < inicio - minutosAntes) return "antes";
  if (minutosActuales >= fin) return "despues";
  return "ok";
}
