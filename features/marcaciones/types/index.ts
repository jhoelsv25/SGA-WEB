export type TipoMarcacionApi = "entrada" | "salida";
export type ResultadoMarcacionApi = "puntual" | "tardanza" | "salida_anticipada" | "fuera_de_turno";
export type OrigenMarcacionApi = "kiosko" | "intranet" | "manual";
export type TipoPersonaMarcacion = "estudiantes" | "docentes" | "administrativos";

export interface MarcacionApi {
  id: string;
  personaId: string;
  nombreCompleto: string;
  fotoUrl: string | null;
  tipoPersona: TipoPersonaMarcacion;
  tipo: TipoMarcacionApi;
  fechaHora: string;
  origen: OrigenMarcacionApi;
  resultado: ResultadoMarcacionApi;
  minutosTardanza: number;
  justificada: boolean;
  motivoJustificacion: string | null;
  justificadaEn: string | null;
  observacion: string | null;
}

export interface PersonaPendiente {
  personaId: string;
  nombreCompleto: string;
  detalle: string | null;
}

export interface GrupoPanel {
  marcaron: MarcacionApi[];
  faltan: PersonaPendiente[];
  totalTardanzas: number;
}

export interface PanelMarcacionesHoy {
  fecha: string;
  diaConClases: boolean;
  estudiantes: GrupoPanel;
  personal: GrupoPanel;
}

export interface RegistrarMarcacionManualPayload {
  personaId: string;
  tipo: TipoMarcacionApi;
  fecha?: string;
  hora: string;
  observacion: string;
}

export interface JustificarMarcacionPayload {
  motivo: string;
}
