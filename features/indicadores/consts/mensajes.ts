import type { Indicador } from "../types";

/**
 * Mensajes textuales exactos según la especificación funcional RF-020.
 * Se utilizan para validaciones previas y notificaciones tipo toast en frontend.
 */
export const MENSAJES_INDICADORES = {
  PRETEST_REGISTRADO: (indicador: Indicador, porcentaje: string | number) =>
    `Pretest de ${indicador} registrado: ${Number(porcentaje).toFixed(2)} %.`,
  PRETEST_SIN_FUENTE: "Indique la fuente del pretest (de dónde se obtuvo el dato).",
  NUMERADOR_MAYOR: "El numerador no puede ser mayor que el denominador.",
  DENOMINADOR_CERO: "El denominador debe ser mayor a 0.",
  NUMERADOR_NEGATIVO: "El numerador no puede ser negativo.",
  FECHAS_INCOHERENTES: "La fecha de fin no puede ser anterior a la fecha de inicio.",
  MEDICION_CERRADA: (
    nombrePeriodo: string,
    csp: string | number,
    isa: string | number,
    igm: string | number,
  ) =>
    `Medición del ${nombrePeriodo} cerrada: CSP ${Number(csp).toFixed(2)} %, ISA ${Number(isa).toFixed(2)} %, IGM ${Number(igm).toFixed(2)} %.`,
  BIMESTRE_ABIERTO: "Solo se puede cerrar la medición de un bimestre cerrado.",
  MEDICION_YA_CERRADA:
    "Este bimestre ya tiene una medición cerrada. Genere una nueva versión indicando el motivo.",
  NUEVA_VERSION_SIN_MOTIVO: "Indique el motivo de la nueva versión.",
  SIN_DATOS: "No hay datos para el periodo y los filtros elegidos.",
  SIN_PRETEST: "Registre el pretest para ver la comparación.",
  ROL_NO_AUTORIZADO:
    "Su rol no tiene autorización para registrar o modificar mediciones ni pretests.",
  DOCENTE_ACCESO_AJENO: "No tiene acceso a los indicadores de otro docente.",
  PERIODO_NO_ENCONTRADO: "Período académico no encontrado.",
  MEDICION_NO_ENCONTRADA: "Medición de bimestre no encontrada.",
  PRETEST_NO_ENCONTRADO: "Pretest no encontrado.",
} as const;
