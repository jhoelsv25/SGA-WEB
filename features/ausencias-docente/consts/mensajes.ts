/**
 * Mensajes oficiales de validación y respuesta del requerimiento RF-012.
 * Textos exactos según la especificación funcional y casos de prueba.
 */
export const MENSAJES_AUSENCIA = {
  AUSENCIA_REGISTRADA: (minutos: number) =>
    `Ausencia registrada: ${minutos} minutos. Se notificó al docente.`,
  HORAS_INVERTIDAS: "La hora final debe ser posterior a la hora inicial.",
  FUERA_HORARIO_SESION: (horario: string) =>
    `El tramo debe estar dentro del horario de la sesión (${horario}).`,
  TRAMOS_SUPERPUESTOS: "El tramo se cruza con otra ausencia registrada en esta sesión.",
  FALTA_OBSERVACION: "Describa la situación cuando el motivo es «Otro».",
  FOTO_INVALIDA: "Las fotos deben ser PNG o JPG de hasta 5 MB.",
  CORRECCION_FUERA_DE_PLAZO:
    "Ya no se puede corregir esta ausencia. Puede anularla indicando el motivo.",
  ANULACION_SIN_MOTIVO: "Indique el motivo de la anulación.",
  CORRECCION_SIN_MOTIVO: "Indique el motivo del cambio.",
  DESCARGO_ENVIADO: "Su descargo fue registrado.",
  DESCARGO_FUERA_DE_PLAZO: (fecha: string) =>
    `El plazo para presentar su descargo venció el ${fecha}.`,
  DESCARGO_REPETIDO: "Ya presentó su descargo para esta ausencia.",
  BIMESTRE_CERRADO:
    "El bimestre está cerrado o consolidado. Las ausencias ya no se pueden modificar.",
  SESION_FUTURA: "Solo se pueden registrar ausencias en sesiones de hoy o anteriores.",
  DESCARGO_OBLIGATORIO: "El texto del descargo es obligatorio.",
} as const;
