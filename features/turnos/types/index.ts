export type TipoPersona = "estudiantes" | "docentes" | "administrativos";

export interface RawTurnoResponse {
  id: string;
  aplicaA?: TipoPersona;
  tipoPersona?: TipoPersona;
  horaEntrada: string;
  horaSalida: string;
  ventanaEntradaInicio: string;
  ventanaEntradaFin: string;
  ventanaSalidaInicio: string;
  ventanaSalidaFin: string;
  toleranciaMin?: number;
  toleranciaMinutos?: number;
  diasLaborables: string | number[];
  activo: boolean;
  creadoEn?: string;
  actualizadoEn?: string;
  createdAt?: string;
  updatedAt?: string;
}

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
