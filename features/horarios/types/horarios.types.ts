export type TipoBloque = "clase" | "receso";

export interface BloqueHorario {
  id: string;
  seccionId: string;
  cursoSeccionId?: string | null;
  cursoNombre?: string | null;
  colorHex?: string | null;
  docenteNombre?: string | null;
  diaSemana: number; // 1 = Lunes, ..., 5 = Viernes
  horaInicio: string; // Formato HH:mm
  horaFin: string; // Formato HH:mm
  tipoBloque: TipoBloque;
  aula?: string | null;
}

export interface ResumenHorasCurso {
  cursoId: string;
  cursoNombre: string;
  horasHorario: number;
  horasPlan: number;
}

export interface HorarioSeccionResponse {
  bloques: BloqueHorario[];
  resumenHoras: ResumenHorasCurso[];
  advertencias: string[];
}

export interface BloquePropuesta {
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  tipoBloque: TipoBloque;
  cursoNombre?: string | null;
}

export interface GrillaPropuestaResponse {
  horaEntrada: string;
  bloques: BloquePropuesta[];
}

export interface CreateBloquePayload {
  cursoSeccionId?: string | null;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  tipoBloque: TipoBloque;
  aula?: string | null;
}

export interface UpdateBloquePayload {
  cursoSeccionId?: string | null;
  diaSemana?: number;
  horaInicio?: string;
  horaFin?: string;
  tipoBloque?: TipoBloque;
  aula?: string | null;
}

export interface BloqueMutacionResponse {
  bloque: BloqueHorario;
  advertencias: string[];
  mensaje?: string;
}

export interface ConflictoHorarioCopia {
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  cursoNombre: string;
  mensaje: string;
}

export interface CopiarHorarioResponse {
  bloquesCreados: number;
  conflictos: ConflictoHorarioCopia[];
}

export interface SeccionHorarioItem {
  id: string;
  anioAcademicoId: string;
  gradoId: string;
  gradoNumero: number;
  gradoNombre: string;
  nombre: string;
  aula: string | null;
  vacantes: number;
  estado: "activa" | "cerrada";
  matriculados: number;
  totalCursos: number;
  cursosSinDocente: number;
}

export interface CargaDocenteResumen {
  id: string;
  codigo: string;
  nombreCompleto: string;
}

export interface CargaItemHorario {
  id: string; // cursoSeccionId
  cursoId: string;
  cursoNombre: string;
  colorHex: string | null;
  horasPlan: number;
  horasHorario: number;
  docente: CargaDocenteResumen | null;
}

export interface CargaSeccionHorarioResponse {
  seccionId: string;
  items: CargaItemHorario[];
}

export interface BloquePropuestoIa {
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  tipoBloque: "clase" | "receso";
  cursoSeccionId: string | null;
  cursoNombre: string | null;
  docenteId: string | null;
}

export interface PropuestaHorarioIaResponse {
  horaEntrada: string;
  bloques: BloquePropuestoIa[];
  usandoIa: boolean;
  advertencias: string[];
}

export interface CrearBloquesLotePayload {
  bloques: CreateBloquePayload[];
  reemplazarExistentes?: boolean;
}

export interface BloquesLoteResponse {
  bloques: BloqueHorario[];
  totalCreados: number;
  advertencias: string[];
}
