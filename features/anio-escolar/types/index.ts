export const ESTADOS_ANIO = ["planificado", "en_curso", "cerrado", "reabierto"] as const;
export type EstadoAnio = (typeof ESTADOS_ANIO)[number];

export const ESTADOS_BIMESTRE = ["planificado", "en_curso", "cerrado"] as const;
export type EstadoBimestre = (typeof ESTADOS_BIMESTRE)[number];

export const TIPOS_EVENTO = [
  "feriado",
  "suspension",
  "jornada_pedagogica",
  "reunion",
  "actividad",
  "examen",
] as const;
export type TipoEvento = (typeof TIPOS_EVENTO)[number];

export const NOMBRES_BIMESTRE = ["I", "II", "III", "IV"] as const;

export const TIPOS_SUSPENDEN_POR_DEFECTO: ReadonlySet<TipoEvento> = new Set([
  "feriado",
  "suspension",
  "jornada_pedagogica",
]);

export interface Bimestre {
  id: string;
  numero: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoBimestre;
}

export interface AnioAcademico {
  id: string;
  anio: number;
  nombre: string | null;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoAnio;
  reabiertoHasta: string | null;
  motivoReapertura: string | null;
  bimestres: Bimestre[];
}

export interface BimestreFechaInput {
  numero: number;
  fechaInicio: string;
  fechaFin: string;
}

export interface CreateAnioPayload {
  anio: number;
  nombre?: string;
  fechaInicio: string;
  fechaFin: string;
  bimestres?: BimestreFechaInput[];
}

export interface UpdateAnioPayload {
  nombre?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface ReabrirAnioPayload {
  motivo: string;
  fechaLimite: string;
}

export interface EventoCalendario {
  id: string;
  anioAcademicoId: string;
  titulo: string;
  descripcion: string | null;
  tipo: TipoEvento;
  fechaInicio: string;
  fechaFin: string;
  suspendeClases: boolean;
  mensaje?: string;
}

export interface CalendarioConsulta {
  anioAcademicoId: string;
  anio: number;
  desde: string;
  hasta: string;
  eventos: EventoCalendario[];
  diasSinClases: string[];
}

export interface GuardarEventoPayload {
  titulo: string;
  descripcion?: string;
  tipo: TipoEvento;
  fechaInicio: string;
  fechaFin: string;
  suspendeClases?: boolean;
  anioAcademicoId?: string;
}
