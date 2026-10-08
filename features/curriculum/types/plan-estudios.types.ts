import type { Curso } from "./cursos.types";
import type { Grado } from "./grados.types";

export interface PlanEstudioItem {
  id: string;
  gradoId: string;
  cursoId: string;
  horasSemanales: number;
  activo: boolean;
  curso: Curso;
}

export interface PlanEstudioResponse {
  gradoId: string;
  grado: Grado;
  totalHoras: number;
  cursos: PlanEstudioItem[];
}

export interface AddCursoPlanPayload {
  cursoId: string;
  horasSemanales: number;
}

export interface UpdateHorasPlanPayload {
  horasSemanales: number;
}
