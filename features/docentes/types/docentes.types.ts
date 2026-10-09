import type { CreatePersonaInput, Persona } from "../../personas/types/personas.types";

export type TipoContrato = "nombrado" | "contratado" | "practicante";
export type JornadaHoras = 20 | 24 | 30 | 40;
export type EstadoDocente = "activo" | "licencia" | "cesado";

export interface DocenteUsuarioSummary {
  id: string;
  nombreUsuario: string;
  estado: string;
}

export interface DocenteCredencialSummary {
  id: string;
  codigo: string;
  activa: boolean;
}

export interface Docente {
  id: string;
  codigo: string;
  personaId: string;
  persona: Persona;
  especialidad?: string | null;
  tituloProfesional?: string | null;
  tipoContrato: TipoContrato;
  jornadaHoras: JornadaHoras;
  fechaIngreso: string;
  fechaCese?: string | null;
  estado: EstadoDocente;
  firmaUrl?: string | null;
  cargoVigente?: string | null;
  usuario?: DocenteUsuarioSummary | null;
  credencial?: DocenteCredencialSummary | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface PaginatedDocentesResponse {
  data: Docente[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export interface DocenteQueryParams {
  cursor?: string | null;
  limit?: number;
  search?: string;
  tipoContrato?: TipoContrato;
  estado?: EstadoDocente;
}

export interface CreateDocenteInput {
  personaId?: string;
  nuevaPersona?: CreatePersonaInput;
  codigo: string;
  especialidad?: string;
  tituloProfesional?: string;
  tipoContrato: TipoContrato;
  jornadaHoras: JornadaHoras;
  fechaIngreso: string;
  cargoId?: string;
  firmaUrl?: string;
}

export interface CreateDocenteResponse {
  docente: Docente;
  tempPassword?: string | null;
  credencial: {
    codigo: string;
    pin: string;
  };
}

export interface UpdateDocenteInput {
  especialidad?: string;
  tituloProfesional?: string;
  tipoContrato?: TipoContrato;
  jornadaHoras?: JornadaHoras;
  fechaIngreso?: string;
  fechaCese?: string;
  estado?: EstadoDocente;
  firmaUrl?: string;
  motivo?: string;
}

export interface CesarDocenteInput {
  fechaCese: string;
  motivo?: string;
}
