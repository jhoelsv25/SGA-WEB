/**
 * Mensajes oficiales del requerimiento RF-013: Consolidado y Ficha de Seguimiento Docente.
 * Textos exactos según la especificación funcional y el contrato backend.
 */
export const MENSAJES_CONSOLIDADO = {
  CONSOLIDADO_GENERADO: (bimestre: string, cantidad: number) =>
    `Consolidado del ${bimestre} generado para ${cantidad} docentes.`,
  CONSOLIDADO_YA_EXISTE:
    "El docente ya tiene un consolidado vigente para este bimestre. Reábralo para actualizarlo.",
  BIMESTRE_AUN_ABIERTO:
    "Solo se puede generar el consolidado en la última semana del bimestre o después de cerrarlo.",
  CONSOLIDADO_REABIERTO:
    "Consolidado reabierto. Ya se pueden corregir las sesiones y ausencias del docente en este bimestre.",
  NUEVO_CIERRE_SIN_MOTIVO: "Indique el motivo del cambio.",
  NUEVA_VERSION: (version: number) => `Se generó la versión ${version} del consolidado.`,
  SOLICITUD_ENVIADA: "Su solicitud de revisión fue enviada al Director.",
  SOLICITUD_SIN_MOTIVO: "Indique el motivo de su solicitud.",
  SOLICITUD_REPETIDA: "Ya tiene una solicitud de revisión pendiente para este consolidado.",
  SOLICITUD_RECHAZADA_SIN_RESPUESTA: "Indique la respuesta para el docente.",
  CONSOLIDADO_CERRADO: "El consolidado de este bimestre está cerrado. Solicite su reapertura.",
  CONSOLIDADO_NO_ENCONTRADO: "Consolidado docente no encontrado.",
  SOLICITUD_NO_ENCONTRADA: "Solicitud de revisión no encontrada.",
  SIN_AUTORIZACION_MODIFICAR: "Su rol no tiene autorización para modificar el consolidado.",
  DOCENTE_SIN_ACCESO_OTRO: "No tiene acceso al consolidado de otro docente.",
} as const;
