import { apiClient } from "@/lib/api-client";
import type { CreateTurnoPayload, TipoPersona, Turno, UpdateTurnoPayload } from "../types";

interface RawTurnoResponse {
  id: string;
  aplicaA?: TipoPersona;
  tipoPersona?: TipoPersona;
  horaEntrada: string;
  horaSalida: string;
  ventanaEntradaInicio: string;
  ventanaEntradaFin: string;
  ventanaSalidaInicio: string;
  ventanaSalidaFin: string;
  toleranciaMin?: number;
  toleranciaMinutos?: number;
  diasLaborables: string | number[];
  activo: boolean;
  creadoEn?: string;
  actualizadoEn?: string;
  createdAt?: string;
  updatedAt?: string;
}

function formatTime(time?: string): string {
  if (!time) return "";
  const parts = time.split(":");
  if (parts.length >= 2) {
    return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
  }
  return time;
}

function parseDiasLaborables(dias: string | number[] | undefined): number[] {
  if (!dias) return [];
  if (Array.isArray(dias)) {
    return dias.map(Number).filter((n) => !Number.isNaN(n));
  }
  return dias
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n));
}

function normalizeTurno(raw: RawTurnoResponse): Turno {
  return {
    id: raw.id,
    tipoPersona: (raw.tipoPersona || raw.aplicaA || "docentes") as TipoPersona,
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

export async function getTurnos(): Promise<Turno[]> {
  const response = await apiClient.get<RawTurnoResponse[]>("/turnos");
  return (response.data || []).map(normalizeTurno);
}

export async function getTurnoById(id: string): Promise<Turno> {
  const response = await apiClient.get<RawTurnoResponse>(`/turnos/${id}`);
  return normalizeTurno(response.data);
}

export async function createTurno(payload: CreateTurnoPayload): Promise<Turno> {
  const requestBody = {
    aplicaA: payload.tipoPersona,
    tipoPersona: payload.tipoPersona,
    horaEntrada: payload.horaEntrada,
    ventanaEntradaInicio: payload.ventanaEntradaInicio,
    ventanaEntradaFin: payload.ventanaEntradaFin,
    horaSalida: payload.horaSalida,
    ventanaSalidaInicio: payload.ventanaSalidaInicio,
    ventanaSalidaFin: payload.ventanaSalidaFin,
    toleranciaMin: payload.toleranciaMinutos,
    toleranciaMinutos: payload.toleranciaMinutos,
    diasLaborables: Array.isArray(payload.diasLaborables)
      ? payload.diasLaborables.join(",")
      : payload.diasLaborables,
    activo: payload.activo ?? true,
  };

  const response = await apiClient.post<RawTurnoResponse>("/turnos", requestBody);
  return normalizeTurno(response.data);
}

export async function updateTurno(id: string, payload: UpdateTurnoPayload): Promise<Turno> {
  const requestBody: Record<string, unknown> = {};

  if (payload.horaEntrada !== undefined) requestBody.horaEntrada = payload.horaEntrada;
  if (payload.ventanaEntradaInicio !== undefined) {
    requestBody.ventanaEntradaInicio = payload.ventanaEntradaInicio;
  }
  if (payload.ventanaEntradaFin !== undefined) {
    requestBody.ventanaEntradaFin = payload.ventanaEntradaFin;
  }
  if (payload.horaSalida !== undefined) requestBody.horaSalida = payload.horaSalida;
  if (payload.ventanaSalidaInicio !== undefined) {
    requestBody.ventanaSalidaInicio = payload.ventanaSalidaInicio;
  }
  if (payload.ventanaSalidaFin !== undefined) {
    requestBody.ventanaSalidaFin = payload.ventanaSalidaFin;
  }
  if (payload.toleranciaMinutos !== undefined) {
    requestBody.toleranciaMin = payload.toleranciaMinutos;
    requestBody.toleranciaMinutos = payload.toleranciaMinutos;
  }
  if (payload.diasLaborables !== undefined) {
    requestBody.diasLaborables = Array.isArray(payload.diasLaborables)
      ? payload.diasLaborables.join(",")
      : payload.diasLaborables;
  }
  if (payload.activo !== undefined) {
    requestBody.activo = payload.activo;
  }

  const response = await apiClient.patch<RawTurnoResponse>(`/turnos/${id}`, requestBody);
  return normalizeTurno(response.data);
}
