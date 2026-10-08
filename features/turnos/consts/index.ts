import type { TipoPersona } from "../types";

export interface TipoPersonaMeta {
  label: string;
  description: string;
  badgeClass: string;
  accentColor: string;
}

export const TIPO_PERSONA_META: Record<TipoPersona, TipoPersonaMeta> = {
  estudiantes: {
    label: "Estudiantes",
    description: "Horario de ingreso escolar y salida de alumnos de primaria y secundaria.",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    accentColor: "blue",
  },
  docentes: {
    label: "Docentes",
    description: "Jornada pedagógica y registro de asistencia del personal de enseñanza.",
    badgeClass: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
    accentColor: "purple",
  },
  administrativos: {
    label: "Administrativos",
    description: "Personal de secretaría, dirección, mantenimiento y soporte del colegio.",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    accentColor: "emerald",
  },
};

export const DIAS_SEMANA = [
  { value: 1, label: "Lunes", short: "L" },
  { value: 2, label: "Martes", short: "M" },
  { value: 3, label: "Miércoles", short: "M" },
  { value: 4, label: "Jueves", short: "J" },
  { value: 5, label: "Viernes", short: "V" },
  { value: 6, label: "Sábado", short: "S" },
  { value: 7, label: "Domingo", short: "D" },
] as const;

export const DIAS_LABORABLES_DEFAULT = [1, 2, 3, 4, 5]; // Lunes a Viernes
