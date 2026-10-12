import type { DiaSemanaDef } from "../types";

export const DIAS_SEMANA_LABORALES: readonly DiaSemanaDef[] = [
  { numero: 1, nombreCorto: "Lun", nombreCompleto: "Lunes" },
  { numero: 2, nombreCorto: "Mar", nombreCompleto: "Martes" },
  { numero: 3, nombreCorto: "Mié", nombreCompleto: "Miércoles" },
  { numero: 4, nombreCorto: "Jue", nombreCompleto: "Jueves" },
  { numero: 5, nombreCorto: "Vie", nombreCompleto: "Viernes" },
] as const;

export const TEXTOS_MI_HORARIO = {
  TITULO_PAGINA: "Mi horario",
  DESCRIPCION_DOCENTE: "Consulta de tus asignaciones lectivas semanales por día y sección.",
  DESCRIPCION_ESTUDIANTE: "Horario semanal de clases y recesos de tu sección.",
  SIN_HORARIO_TITULO: "Aún no hay horario registrado",
  SIN_HORARIO_DESCRIPCION:
    "No se han programado bloques de clase ni recesos para este período académico.",
  ROL_SIN_HORARIO_TITULO: "Este rol no tiene un horario propio",
  ROL_SIN_HORARIO_DESCRIPCION:
    "La consulta directa de horario escolar está destinada a docentes y estudiantes de la institución.",
  APODERADO_SIN_LISTADO_TITULO: "Sin estudiantes vinculados",
  APODERADO_SIN_LISTADO_DESCRIPCION:
    "Tu cuenta de apoderado no tiene estudiantes vinculados. Comunícate con Secretaría si crees que es un error.",
  DESCRIPCION_APODERADO: "Horario semanal de clases y recesos del estudiante seleccionado.",
  SELECTOR_ESTUDIANTE_LABEL: "Estudiante",
  ETIQUETA_RECESO: "Receso",
  ETIQUETA_AULA: "Aula",
  ETIQUETA_SIN_AULA: "Sin aula asignada",
  ETIQUETA_BLOQUE_DOBLE: "Bloque doble",
} as const;
