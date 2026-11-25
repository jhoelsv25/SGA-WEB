import type { Persona } from "../../personas/types/personas.types";

export type GradoInstruccion =
  "sin_estudios" | "primaria" | "secundaria" | "tecnica" | "universitaria" | "posgrado";

export type Parentesco =
  | "padre"
  | "madre"
  | "abuelo"
  | "abuela"
  | "hermano"
  | "hermana"
  | "tio"
  | "tia"
  | "tutor_legal"
  | "otro";

export interface EstudianteVinculado {
  estudianteId: string;
  codigoSiagie: string;
  nombreCompleto: string;
  parentesco: string;
  esPrincipal: boolean;
  viveConEstudiante: boolean;
  autorizadoRecoger: boolean;
  contactoEmergencia: boolean;
}

export interface Apoderado {
  id: string;
  personaId: string;
  ocupacion: string | null;
  centroLaboral: string | null;
  telefonoLaboral: string | null;
  gradoInstruccion: GradoInstruccion | null;
  cargoVigente: string | null;
  usuario: {
    id: string;
    nombreUsuario: string;
    estado: string;
  } | null;
  estudiantes: EstudianteVinculado[];
  creadoEn: string;
  actualizadoEn: string;
  persona: Persona;
}

export interface VinculoFamiliar {
  estudianteId: string;
  apoderadoId: string;
  parentesco: string;
  esPrincipal: boolean;
  viveConEstudiante: boolean;
  autorizadoRecoger: boolean;
  contactoEmergencia: boolean;
  creadoEn: string;
}

export interface CreateApoderadoPayload {
  personaId?: string;
  nuevaPersona?: {
    tipoDocumento: "dni" | "carne_extranjeria" | "pasaporte" | "partida_nacimiento";
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
  };
  ocupacion?: string;
  centroLaboral?: string;
  telefonoLaboral?: string;
  gradoInstruccion?: GradoInstruccion;
  estudianteId?: string;
  parentesco?: Parentesco;
  esPrincipal?: boolean;
  viveConEstudiante?: boolean;
  autorizadoRecoger?: boolean;
  contactoEmergencia?: boolean;
}

export interface UpdateApoderadoPayload {
  ocupacion?: string;
  centroLaboral?: string;
  telefonoLaboral?: string;
  gradoInstruccion?: GradoInstruccion;
}

export interface VincularEstudiantePayload {
  estudianteId: string;
  apoderadoId: string;
  parentesco: Parentesco;
  esPrincipal?: boolean;
  viveConEstudiante?: boolean;
  autorizadoRecoger?: boolean;
  contactoEmergencia?: boolean;
}

export interface CreateApoderadoResponse {
  apoderado: Apoderado;
  tempPassword: string | null;
  vinculo?: VinculoFamiliar | null;
}

export interface PaginatedApoderadosResponse {
  data: Apoderado[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export interface ResumenApoderadosResponse {
  total: number;
  conEstudiantes: number;
  principales: number;
  conCuenta: number;
}
