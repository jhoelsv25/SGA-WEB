import { apiClient, handleApiError } from "@/lib/api-client";
import { TURNOS_ENDPOINTS } from "../consts";
import type { CreateTurnoPayload, RawTurnoResponse, Turno, UpdateTurnoPayload } from "../types";
import { normalizeTurno } from "../utils";

export async function getTurnos(): Promise<Turno[]> {
  try {
    const response = await apiClient.get<RawTurnoResponse[]>(TURNOS_ENDPOINTS.BASE);
    return (response.data || []).map(normalizeTurno);
  } catch (error) {
    handleApiError(error, "Error al obtener la lista de turnos.");
  }
}

export async function getTurnoById(id: string): Promise<Turno> {
  try {
    const response = await apiClient.get<RawTurnoResponse>(TURNOS_ENDPOINTS.BY_ID(id));
    return normalizeTurno(response.data);
  } catch (error) {
    handleApiError(error, "Error al obtener el turno.");
  }
}

export async function createTurno(payload: CreateTurnoPayload): Promise<Turno> {
  try {
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

    const response = await apiClient.post<RawTurnoResponse>(TURNOS_ENDPOINTS.BASE, requestBody);
    return normalizeTurno(response.data);
  } catch (error) {
    handleApiError(error, "Error al crear el turno.");
  }
}

export async function updateTurno(id: string, payload: UpdateTurnoPayload): Promise<Turno> {
  try {
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

    const response = await apiClient.patch<RawTurnoResponse>(
      TURNOS_ENDPOINTS.BY_ID(id),
      requestBody,
    );
    return normalizeTurno(response.data);
  } catch (error) {
    handleApiError(error, "Error al actualizar el turno.");
  }
}
