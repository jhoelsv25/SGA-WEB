export type TipoDocumento = "dni" | "carne_extranjeria" | "pasaporte" | "partida_nacimiento";

export interface FichasPersona {
  esDocente: boolean;
  esEstudiante: boolean;
  esApoderado: boolean;
  tieneUsuario: boolean;
}

export interface Persona {
  id: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string | null;
  nombreCompleto: string;
  sexo: "M" | "F";
  fechaNacimiento?: string | null;
  direccion?: string | null;
  distrito?: string | null;
  telefono?: string | null;
  celular?: string | null;
  correo?: string | null;
  fotoUrl?: string | null;
  esProvisional: boolean;
  fichas: FichasPersona;
  cargoVigente?: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface PaginatedPersonasResponse {
  data: Persona[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export interface PersonaQueryParams {
  cursor?: string | null;
  limit?: number;
  search?: string;
  tipoDocumento?: TipoDocumento;
  esProvisional?: boolean;
  destinoFicha?: "docente" | "estudiante" | "apoderado";
}

export interface SearchPersonaResult {
  encontrada: boolean;
  persona?: Persona | null;
  mensaje?: string;
  yaTieneFicha?: boolean;
}

export interface CreatePersonaInput {
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  sexo: "M" | "F";
  fechaNacimiento?: string;
  direccion?: string;
  distrito?: string;
  telefono?: string;
  celular?: string;
  correo?: string;
  fotoUrl?: string;
}

export interface UpdatePersonaInput extends Partial<CreatePersonaInput> {
  motivo?: string;
}
