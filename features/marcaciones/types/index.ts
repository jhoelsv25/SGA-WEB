import type { Sesion } from "@/features/sesiones/types";

export type TipoMarcacionApi = "entrada" | "salida";
export type ResultadoMarcacionApi = "puntual" | "tardanza" | "salida_anticipada" | "fuera_de_turno";
export type OrigenMarcacionApi = "kiosko" | "intranet" | "manual" | "biometrico";
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

export type EstadoDia =
  | "completo"
  | "en_el_colegio"
  | "sin_salida"
  | "sin_entrada"
  | "por_llegar"
  | "sin_marca"
  | "no_corresponde";

export interface DiaDePersona {
  fecha: string;
  estado: EstadoDia;
  horario: { fuente: "clases" | "turno"; entrada: string; salida: string } | null;
  entrada: MarcacionApi | null;
  salida: MarcacionApi | null;
  sesiones: Sesion[];
}

export interface PersonaControl extends DiaDePersona {
  personaId: string;
  nombreCompleto: string;
  fotoUrl: string | null;
  tipoPersona: "docentes" | "administrativos";
}

export interface ControlDiario {
  fecha: string;
  esHoy: boolean;
  sinClases: boolean;
  personalLabora: boolean;
  personas: PersonaControl[];
}

export interface ControlMensual {
  mes: string;
  personaId: string;
  nombreCompleto: string;
  tipoPersona: "docentes" | "administrativos";
  dias: DiaDePersona[];
}
