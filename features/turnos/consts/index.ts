import type { TipoPersona } from "../types";

export interface TipoPersonaMeta {
  label: string;
  description: string;
}

export const TIPO_PERSONA_META: Record<TipoPersona, TipoPersonaMeta> = {
  estudiantes: {
    label: "Estudiantes",
    description: "Horario de ingreso escolar y salida de alumnos de primaria y secundaria.",
  },
  docentes: {
    label: "Docentes",
    description: "Jornada pedagógica y registro de asistencia del personal de enseñanza.",
  },
  administrativos: {
    label: "Administrativos",
    description: "Personal de secretaría, dirección, mantenimiento y soporte del colegio.",
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
