import type { PropositoEquipo, TipoEquipo, UsuarioPermitido } from "../types";

export const KIOSK_TOKEN_STORAGE_KEY = "sga_kiosk_token";

export const TIPO_EQUIPO_OPTIONS = [
  { value: "kiosko", label: "Kiosko (PC o Tablet con pantalla del sistema)" },
  { value: "biometrico", label: "Reloj Biométrico (Huella digital / Reconocimiento)" },
];

export const PROPOSITO_EQUIPO_OPTIONS = [
  { value: "marcacion", label: "Marcación de Asistencia (Entrada / Salida)" },
  { value: "sesiones", label: "Firma de Sesiones de Clase (Exclusivo Docentes)" },
];

export const USUARIOS_PERMITIDOS_OPTIONS: {
  value: UsuarioPermitido;
  label: string;
}[] = [
  { value: "estudiantes", label: "Estudiantes" },
  { value: "docentes", label: "Docentes" },
  { value: "administrativos", label: "Administrativos" },
];

export const TIPO_EQUIPO_META: Record<TipoEquipo, { label: string; badgeClass: string }> = {
  kiosko: {
    label: "Kiosko Web",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  },
  biometrico: {
    label: "Reloj Biométrico",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  },
};

export const PROPOSITO_EQUIPO_META: Record<PropositoEquipo, { label: string; badgeClass: string }> =
  {
    marcacion: {
      label: "Asistencia General",
      badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    },
    sesiones: {
      label: "Firma de Sesiones",
      badgeClass: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
    },
  };
