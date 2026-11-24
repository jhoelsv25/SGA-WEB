import type {
  CreatePersonaInput,
  DarBajaFichaActualInput,
  Persona,
} from "../../personas/types/personas.types";

export type EstadoEstudiante = "activo" | "retirado" | "trasladado" | "egresado";

export interface EstudianteUsuarioSummary {
  id: string;
  nombreUsuario: string;
  estado: string;
}

export interface EstudianteCredencialSummary {
  id: string;
  codigo: string;
  activa: boolean;
}

export interface Estudiante {
  id: string;
  codigo: string;
  personaId: string;
  persona: Persona;
  fechaIngreso: string;
  lenguaMaterna?: string | null;
  religion?: string | null;
  tieneDiscapacidad: boolean;
  detalleDiscapacidad?: string | null;
  grupoSanguineo?: string | null;
  alergias?: string | null;
  condicionesMedicas?: string | null;
  seguroSalud?: string | null;
  estado: EstadoEstudiante;
  cargoVigente?: string | null;
  usuario?: EstudianteUsuarioSummary | null;
  credencial?: EstudianteCredencialSummary | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface PaginatedEstudiantesResponse {
  data: Estudiante[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export interface EstudianteQueryParams {
  cursor?: string | null;
  limit?: number;
  search?: string;
  estado?: EstadoEstudiante;
}

export interface ResumenEstudiantesResponse {
  total: number;
  activos: number;
  trasladados: number;
  retirados: number;
  egresados: number;
}

export interface CreateEstudianteInput {
  personaId?: string;
  nuevaPersona?: CreatePersonaInput;
  /** RF-007 V4: baja de la otra ficha académica vigente (cambio de condición). */
  darBajaFichaActual?: DarBajaFichaActualInput;
  codigo: string;
  fechaIngreso: string;
  lenguaMaterna?: string;
  religion?: string;
  tieneDiscapacidad?: boolean;
  detalleDiscapacidad?: string;
  grupoSanguineo?: string;
  alergias?: string;
  condicionesMedicas?: string;
  seguroSalud?: string;
}

export interface CreateEstudianteResponse {
  estudiante: Estudiante;
  tempPassword?: string | null;
  credencial: {
    codigo: string;
    pin: string;
  };
}

export interface UpdateEstudianteInput {
  fechaIngreso?: string;
  lenguaMaterna?: string;
  religion?: string;
  tieneDiscapacidad?: boolean;
  detalleDiscapacidad?: string;
  grupoSanguineo?: string;
  alergias?: string;
  condicionesMedicas?: string;
  seguroSalud?: string;
  estado?: EstadoEstudiante;
  motivo?: string;
}
