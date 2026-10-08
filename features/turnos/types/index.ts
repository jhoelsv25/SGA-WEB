export type TipoPersona = "estudiantes" | "docentes" | "administrativos";

export interface Turno {
  id: string;
  tipoPersona: TipoPersona;
  horaEntrada: string;
  ventanaEntradaInicio: string;
  ventanaEntradaFin: string;
  horaSalida: string;
  ventanaSalidaInicio: string;
  ventanaSalidaFin: string;
  toleranciaMinutos: number;
  diasLaborables: number[];
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTurnoPayload {
  tipoPersona: TipoPersona;
  horaEntrada: string;
  ventanaEntradaInicio: string;
  ventanaEntradaFin: string;
  horaSalida: string;
  ventanaSalidaInicio: string;
  ventanaSalidaFin: string;
  toleranciaMinutos: number;
  diasLaborables: number[];
  activo?: boolean;
}

export interface UpdateTurnoPayload {
  horaEntrada?: string;
  ventanaEntradaInicio?: string;
  ventanaEntradaFin?: string;
  horaSalida?: string;
  ventanaSalidaInicio?: string;
  ventanaSalidaFin?: string;
  toleranciaMinutos?: number;
  diasLaborables?: number[];
  activo?: boolean;
}
