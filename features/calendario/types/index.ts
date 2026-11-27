export const TIPOS_EVENTO = [
  "feriado",
  "suspension",
  "jornada_pedagogica",
  "reunion",
  "actividad",
  "examen",
] as const;
export type TipoEvento = (typeof TIPOS_EVENTO)[number];

export const TIPOS_SUSPENDEN_POR_DEFECTO: ReadonlySet<TipoEvento> = new Set([
  "feriado",
  "suspension",
  "jornada_pedagogica",
]);

export interface EventoCalendario {
  id: string;
  anioAcademicoId: string;
  titulo: string;
  descripcion: string | null;
  tipo: TipoEvento;
  fechaInicio: string;
  fechaFin: string;
  suspendeClases: boolean;
  /** Sin clases, pero docentes y auxiliares trabajan. */
  personalLabora: boolean;
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
  personalLabora?: boolean;
  anioAcademicoId?: string;
}
