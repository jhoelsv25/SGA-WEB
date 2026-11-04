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

export interface ClonarSeccionesPayload {
  anioOrigenId: string;
  copiarTutores?: boolean;
  copiarAulas?: boolean;
}

export interface SeccionClonadaDetalle {
  id: string;
  gradoNombre: string;
  nombre: string;
  aula: string | null;
  vacantes: number;
  tutorAsignado: boolean;
}

export interface SeccionOmitidaDetalle {
  gradoNombre: string;
  nombre: string;
  motivo: string;
}

export interface ClonarSeccionesResultado {
  mensaje: string;
  totalClonadas: number;
  totalOmitidas: number;
  clonadas: SeccionClonadaDetalle[];
  omitidas: SeccionOmitidaDetalle[];
}
