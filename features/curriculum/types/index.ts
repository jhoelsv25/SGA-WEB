export interface Grado {
  id: string;
  numero: number;
  nombre: string;
  creadoEn: string;
  actualizadoEn: string;
}

export type AreaCurricular =
  | "matematica"
  | "comunicacion"
  | "ingles"
  | "arte_cultura"
  | "ciencias_sociales"
  | "dpcc"
  | "educacion_fisica"
  | "educacion_religiosa"
  | "ciencia_tecnologia"
  | "ept"
  | "taller"
  | "tutoria";

export interface Curso {
  id: string;
  codigo: string;
  nombre: string;
  areaCurricular: AreaCurricular;
  areaCurricularNombre: string;
  descripcion: string | null;
  colorHex: string | null;
  activo: boolean;
  eliminadoEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

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

export interface CreateCursoPayload {
  codigo: string;
  nombre: string;
  areaCurricular: AreaCurricular;
  descripcion?: string;
  colorHex?: string;
}

export interface UpdateCursoPayload {
  codigo?: string;
  nombre?: string;
  areaCurricular?: AreaCurricular;
  descripcion?: string;
  colorHex?: string;
}

export interface FilterCursoParams {
  estado?: "activo" | "inactivo" | "todos";
  areaCurricular?: AreaCurricular;
  search?: string;
}

export interface AddCursoPlanPayload {
  cursoId: string;
  horasSemanales: number;
}

export interface UpdateHorasPlanPayload {
  horasSemanales: number;
}

export interface UpdateGradoPayload {
  nombre: string;
}
