export const ESTADOS_ANIO = ["planificado", "en_curso", "cerrado", "reabierto"] as const;
export type EstadoAnio = (typeof ESTADOS_ANIO)[number];

export const ESTADOS_BIMESTRE = ["planificado", "en_curso", "cerrado"] as const;
export type EstadoBimestre = (typeof ESTADOS_BIMESTRE)[number];

export const NOMBRES_BIMESTRE = ["I", "II", "III", "IV"] as const;

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
