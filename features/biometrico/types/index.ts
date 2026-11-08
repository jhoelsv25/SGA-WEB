export interface CodigoBiometricoApi {
  personaId: string;
  nombreCompleto: string;
  codigoBiometrico: string | null;
  mensaje: string;
}

export interface HoraProgramada {
  /** HH:mm, 24 horas */
  hora: string;
  /** 1 = lunes … 7 = domingo, separados por coma */
  dias: string;
  activa: boolean;
}

export interface ProgramacionBiometrico {
  horarios: HoraProgramada[];
  actualizadoEn: string | null;
  mensaje: string;
}

export interface SincronizacionReloj {
  relojSerie: string;
  ultimaMarca: string;
  ultimaSincronizacion: string;
  equipo: string | null;
}
