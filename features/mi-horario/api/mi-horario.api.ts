import { apiClient } from "@/lib/api-client";
import type { HorarioEstudianteResponse, MiHorarioDocenteResponse } from "../types";

export const miHorarioApi = {
  /**
   * Obtiene el horario semanal asignado al docente autenticado.
   * Endpoint: GET /horarios/mi-horario
   */
  async getMiHorarioDocente(): Promise<MiHorarioDocenteResponse> {
    const { data } = await apiClient.get<MiHorarioDocenteResponse>("/horarios/mi-horario");
    return data;
  },

  /**
   * Obtiene el horario semanal de la sección a la que pertenece un estudiante.
   * Endpoint: GET /horarios/estudiante/:estudianteId
   */
  async getHorarioEstudiante(estudianteId: string): Promise<HorarioEstudianteResponse> {
    const { data } = await apiClient.get<HorarioEstudianteResponse>(
      `/horarios/estudiante/${estudianteId}`,
    );
    return data;
  },
};
