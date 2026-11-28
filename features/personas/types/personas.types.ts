export type TipoDocumento = "dni" | "carne_extranjeria" | "pasaporte" | "partida_nacimiento";

export interface FichasPersona {
  esDocente: boolean;
  esEstudiante: boolean;
  esApoderado: boolean;
  tieneUsuario: boolean;
  /** RF-007 V4: id y estado de cada ficha académica (null si no la tiene). */
  docenteId?: string | null;
  estudianteId?: string | null;
  estadoDocente?: string | null;
  estadoEstudiante?: string | null;
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
  /** Ficha vigente que debe darse de baja para registrar a la persona en la otra condición. */
  requiereBajaDe?: "docente" | "estudiante";
}

/** RF-007 V4: baja de la ficha académica vigente al cambiar de condición (docente ↔ estudiante). */
export interface DarBajaFichaActualInput {
  motivo: string;
  fecha?: string;
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

export interface CampoModificado {
  campo: string;
  valorAnterior: unknown;
  valorNuevo: unknown;
}

export interface HistorialCorreccionCritica {
  id: number;
  fechaHora: string;
  usuarioNombre: string | null;
  motivo: string;
  camposModificados: CampoModificado[];
  direccionIp?: string | null;
}

/** RF-002 V3: cambiar el cargo vigente de una persona (el anterior termina y queda en el historial). */
export interface ChangeCargoInput {
  cargoId: string;
  fechaInicio?: string;
}

export interface CargoAsignadoResponse {
  cargoVigente: string;
  rolesSugeridosIds: string[];
}

export interface ResumenPersonasResponse {
  total: number;
  conFicha: number;
  conCuenta: number;
  provisionales: number;
}

export interface OcrDocumentoPersona {
  dni: string | null;
  apellidoPaterno: string | null;
  apellidoMaterno: string | null;
  nombres: string | null;
  fechaNacimiento: string | null;
  sexo: "M" | "F" | null;
  estrategia: string;
}
