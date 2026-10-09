export type TipoImportacion = "personas" | "estudiantes" | "docentes" | "apoderados";

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
  filas: Record<string, unknown>[];
}

export interface EjecutarImportacionInput {
  tipo: TipoImportacion;
  filas: Record<string, unknown>[];
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
