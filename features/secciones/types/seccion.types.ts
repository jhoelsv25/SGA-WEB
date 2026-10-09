export type EstadoSeccion = "activa" | "cerrada";

export interface SeccionTutor {
  id: string;
  codigo: string;
  nombreCompleto: string;
}

export interface Seccion {
  id: string;
  anioAcademicoId: string;
  gradoId: string;
  gradoNumero: number;
  gradoNombre: string;
  nombre: string;
  aula: string | null;
  vacantes: number;
  estado: EstadoSeccion;
  tutor: SeccionTutor | null;
  matriculados: number;
  totalCursos: number;
  cursosSinDocente: number;
}

export interface SeccionQueryParams {
  gradoId?: string;
  estado?: EstadoSeccion;
}

export interface CreateSeccionPayload {
  gradoId: string;
  nombre: string;
  aula?: string;
  vacantes: number;
  tutorId?: string;
}

export interface UpdateSeccionPayload {
  nombre?: string;
  aula?: string;
  vacantes?: number;
  tutorId?: string | null;
}
