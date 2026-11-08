import type { StatusBadgeTone } from "@/components/common/status-badge";
import type { PropositoEquipo, TipoEquipo, UsuarioPermitido } from "../types";

export const KIOSK_TOKEN_STORAGE_KEY = "sga_kiosk_token";

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
