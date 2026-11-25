export type TipoImportacion =
  | "personas"
  | "estudiantes"
  | "docentes"
  | "apoderados"
  | "matriculas"
  | "carga_academica"
  | "horarios";

export type EstadoFilaImportacion = "valida" | "ya_registrada" | "error";
export type AccionFilaImportacion = "crear" | "reutilizar" | "omitir";

export interface FilaPrevisualizada {
  numeroFila: number;
  datos: Record<string, unknown>;
  estado: EstadoFilaImportacion;
  accion: AccionFilaImportacion;
  mensaje?: string;
}

export interface VistaPreviaResponse {
  loteId?: string;
  totalFilas: number;
  validasCount: number;
  omitidasCount: number;
  erroresCount: number;
  filas: FilaPrevisualizada[];
}

export interface CredencialEmitida {
  nombreCompleto: string;
  numeroDocumento: string;
  tipoRol: string;
  nombreUsuario?: string;
  tempPassword?: string;
  codigoCredencial?: string;
  pin?: string;
}

export interface EjecutarImportacionResponse {
  importadosCount: number;
  omitidosCount: number;
  mensaje: string;
  credenciales: CredencialEmitida[];
}

export interface PrevisualizarImportacionInput {
  tipo: TipoImportacion;
  archivo: File;
}

export interface EjecutarImportacionInput {
  tipo: TipoImportacion;
  loteId: string;
}

export interface IniciarImportacionResponse {
  jobId: string;
  estado: "en_cola" | "procesando" | "completado";
  mensaje: string;
  resultado?: EjecutarImportacionResponse;
}

export interface EstadoImportacionJobResponse {
  jobId: string;
  estado: "en_cola" | "procesando" | "completado" | "fallido";
  progreso: number;
  mensaje?: string;
  resultado?: EjecutarImportacionResponse;
  error?: string;
}

export type TipoFotosImportacion = "estudiantes" | "docentes";

export interface IniciarFotosJobResponse {
  jobId: string;
  mensaje: string;
  totalArchivos: number;
}

export interface DetalleFotoAsignada {
  archivo: string;
  personaId: string;
  nombreCompleto: string;
  fotoUrl: string;
}

export interface DetalleFotoOmitida {
  archivo: string;
  motivo: string;
}

export interface ResultadoFotos {
  total: number;
  exitosos: number;
  omitidos: number;
  asignados: DetalleFotoAsignada[];
  detallesOmitidos: DetalleFotoOmitida[];
}

export interface EstadoFotosJobResponse {
  id: string;
  estado: "esperando" | "procesando" | "completado" | "fallido";
  progreso: number;
  resultado?: ResultadoFotos;
  error?: string;
}
