import type { StatusBadgeTone } from "@/components/common/status-badge";
import type { PropositoEquipo, TipoEquipo, UsuarioPermitido } from "../types";

export const ESTADO_SOLICITUD_KIOSKO = { PENDIENTE: 1, APROBADA: 2, RECHAZADA: 3 } as const;

export const ESTADO_SOLICITUD_KIOSKO_META: Record<
  number,
  { label: string; tone: StatusBadgeTone }
> = {
  [ESTADO_SOLICITUD_KIOSKO.PENDIENTE]: { label: "Pendiente", tone: "warning" },
  [ESTADO_SOLICITUD_KIOSKO.APROBADA]: { label: "Aprobada", tone: "success" },
  [ESTADO_SOLICITUD_KIOSKO.RECHAZADA]: { label: "Rechazada", tone: "neutral" },
};

export const TIPO_EQUIPO_OPTIONS = [
  { value: "kiosko", label: "Kiosko (computadora o tableta con pantalla del sistema)" },
];

export const PROPOSITO_EQUIPO_OPTIONS = [
  { value: "marcacion", label: "Marcación de asistencia (entrada y salida)" },
  { value: "sesiones", label: "Firma de sesiones de clase (exclusivo docentes)" },
];

export const USUARIOS_PERMITIDOS_OPTIONS: {
  value: UsuarioPermitido;
  label: string;
}[] = [
  { value: "estudiantes", label: "Estudiantes" },
  { value: "docentes", label: "Docentes" },
  { value: "administrativos", label: "Administrativos" },
];

export const TIPO_EQUIPO_META: Record<TipoEquipo, { label: string; tone: StatusBadgeTone }> = {
  kiosko: {
    label: "Kiosko web",
    tone: "info",
  },
};

export const PROPOSITO_EQUIPO_META: Record<
  PropositoEquipo,
  { label: string; tone: StatusBadgeTone }
> = {
  marcacion: {
    label: "Asistencia general",
    tone: "brand",
  },
  sesiones: {
    label: "Firma de sesiones",
    tone: "info",
  },
};
