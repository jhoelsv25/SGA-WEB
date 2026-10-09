/**
 * Tipos y contratos de datos para la funcionalidad «Mi horario».
 * Representa la consulta semanal de solo lectura para docentes y estudiantes (RF-008 HU3).
 */

export type TipoBloque = "clase" | "receso";

export interface BloqueDocenteDto {
  id: string;
  diaSemana: number; // 1 = Lunes, ..., 5 = Viernes
  horaInicio: string; // Formato "HH:mm"
  horaFin: string; // Formato "HH:mm"
  cursoNombre?: string | null;
  colorHex?: string | null;
  seccionNombre: string;
  gradoNumero: number;
  aula?: string | null;
}

export interface MiHorarioDocenteResponse {
  docenteId: string;
  bloques: BloqueDocenteDto[];
}

export interface BloqueHorarioDto {
  id: string;
  seccionId: string;
  cursoSeccionId?: string | null;
  cursoNombre?: string | null;
  colorHex?: string | null;
  docenteNombre?: string | null;
  diaSemana: number; // 1 = Lunes, ..., 5 = Viernes
  horaInicio: string; // Formato "HH:mm"
  horaFin: string; // Formato "HH:mm"
  tipoBloque: TipoBloque;
  aula?: string | null;
}

export interface HorarioEstudianteResponse {
  seccionId: string;
  bloques: BloqueHorarioDto[];
}

/**
 * Modelo unificado de visualización para un bloque en la grilla horaria.
 */
export interface BloqueHorarioVista {
  id: string;
  diaSemana: number; // 1 a 5
  horaInicio: string; // "HH:mm"
  horaFin: string; // "HH:mm"
  tipoBloque: TipoBloque;
  cursoNombre: string;
  colorHex?: string | null;
  /** Subtítulo contextual: Grado y sección (para docente) o Nombre del docente (para estudiante) */
  subtitulo?: string | null;
  aula?: string | null;
  /** Duración en minutos calculada a partir de horaInicio y horaFin */
  duracionMinutos: number;
  /** Indica si la duración corresponde a dos o más horas pedagógicas */
  esBloqueDoble: boolean;
}

export interface FranjaHoraria {
  horaInicio: string;
  horaFin: string;
  etiqueta: string;
}

export interface DiaSemanaDef {
  numero: number;
  nombreCorto: string;
  nombreCompleto: string;
}

export type RolHorarioActivo = "docente" | "estudiante" | "apoderado" | "otro";
