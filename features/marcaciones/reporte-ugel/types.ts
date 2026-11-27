/** RF-025: reporte mensual de asistencia a la UGEL. */
export const TIPOS_JUSTIFICACION = {
  licencia_con_goce: "Licencia con goce (J)",
  licencia_sin_goce: "Licencia sin goce de remuneraciones (L)",
  permiso_con_goce: "Permiso con goce (J)",
  permiso_sin_goce: "Permiso sin goce de remuneraciones (P)",
  vacaciones: "Vacaciones (J)",
  huelga: "Huelga o paro (H)",
  trabajo_remoto: "Trabajo virtual en día sin clases (A)",
  omision_justificada: "Omisión de marca justificada",
} as const;

export type TipoJustificacion = keyof typeof TIPOS_JUSTIFICACION;

export const DE_UN_DIA: readonly TipoJustificacion[] = [
  "permiso_con_goce",
  "permiso_sin_goce",
  "omision_justificada",
];

export interface FilaReporte {
  personaId: string;
  dni: string;
  nombreCompleto: string;
  cargo: string;
  condicion: string;
  jornada: number | null;
  dias: string[];
  diasInasistencia: number;
  tardanza: { horas: number; minutos: number };
  permisoSinGoce: { horas: number; minutos: number };
  diasHuelga: number;
  observaciones: string;
}

export interface ReporteUgel {
  mes: string;
  borrador: boolean;
  encabezado: {
    dreUgel: string;
    institucion: string;
    nivelModalidad: string;
    turno: string;
    periodo: string;
    lugar: string;
    director: string;
  };
  calendario: { numero: number; inicial: string }[];
  filas: FilaReporte[];
  /** Códigos vigentes del Anexo 03: [código, significado]. */
  leyenda: [string, string][];
  avisos: string[];
}

export interface Justificacion {
  id: string;
  personaId: string;
  nombreCompleto: string;
  tipo: TipoJustificacion;
  fechaDesde: string;
  fechaHasta: string;
  minutos: number | null;
  marcaOmitida: "ingreso" | "salida" | null;
  documento: string;
  observacion: string | null;
  anulada: boolean;
  motivoAnulacion: string | null;
}

export interface NuevaJustificacion {
  personaId: string;
  tipo: TipoJustificacion;
  fechaDesde: string;
  fechaHasta: string;
  minutos?: number;
  documento: string;
  observacion?: string;
  presentadoEn?: string;
  marcaOmitida?: "ingreso" | "salida";
}

export interface PersonaDelReporte {
  personaId: string;
  nombreCompleto: string;
}
