export type AreaCurricular =
  | "matematica"
  | "comunicacion"
  | "quechua"
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

export interface CreateCursoPayload {
  codigo: string;
  nombre: string;
  areaCurricular: AreaCurricular;
  descripcion?: string | null;
  colorHex?: string | null;
}

export interface UpdateCursoPayload {
  codigo?: string;
  nombre?: string;
  areaCurricular?: AreaCurricular;
  descripcion?: string | null;
  colorHex?: string | null;
}

export interface FilterCursoParams {
  estado?: "activo" | "inactivo" | "todos";
  areaCurricular?: AreaCurricular;
  search?: string;
}
