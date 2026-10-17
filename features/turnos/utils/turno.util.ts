import { DEFAULT_TIPO_PERSONA } from "../consts";
import type { RawTurnoResponse, Turno } from "../types";

/**
 * Formatea una hora en formato HH:mm asegurando dos dígitos con ceros a la izquierda.
 */
export function formatTime(time?: string): string {
  if (!time) return "";
  const parts = time.split(":");
  if (parts.length >= 2) {
    return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
  }
  return time;
}

/**
 * Convierte una hora en formato "HH:mm" a minutos acumulados del día.
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Parsea los días laborables admitiendo array de números o string separado por comas.
 */
export function parseDiasLaborables(dias: string | number[] | undefined): number[] {
  if (!dias) return [];
  if (Array.isArray(dias)) {
    return dias.map(Number).filter((n) => !Number.isNaN(n));
  }
  return dias
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n));
}

/**
 * Normaliza la respuesta cruda de la API al modelo tipado institucional `Turno`.
 */
export function normalizeTurno(raw: RawTurnoResponse): Turno {
  return {
    id: raw.id,
    tipoPersona: raw.tipoPersona || raw.aplicaA || DEFAULT_TIPO_PERSONA,
    horaEntrada: formatTime(raw.horaEntrada),
    ventanaEntradaInicio: formatTime(raw.ventanaEntradaInicio),
    ventanaEntradaFin: formatTime(raw.ventanaEntradaFin),
    horaSalida: formatTime(raw.horaSalida),
    ventanaSalidaInicio: formatTime(raw.ventanaSalidaInicio),
    ventanaSalidaFin: formatTime(raw.ventanaSalidaFin),
    toleranciaMinutos: raw.toleranciaMinutos ?? raw.toleranciaMin ?? 0,
    diasLaborables: parseDiasLaborables(raw.diasLaborables),
    activo: Boolean(raw.activo),
    createdAt: raw.creadoEn || raw.createdAt,
    updatedAt: raw.actualizadoEn || raw.updatedAt,
  };
}
