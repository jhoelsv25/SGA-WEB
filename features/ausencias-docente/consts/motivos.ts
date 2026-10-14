/**
 * Motivos válidos para el registro de ausencias docentes (RF-012).
 */
export const MOTIVOS_AUSENCIA = [
  "fuera_del_aula",
  "desayunando",
  "servicios_higienicos",
  "uso_celular",
  "otro",
] as const;

export type MotivoAusencia = (typeof MOTIVOS_AUSENCIA)[number];

/**
 * Etiquetas legibles en español para cada motivo de ausencia docente.
 */
export const ETIQUETAS_MOTIVO_AUSENCIA: Record<MotivoAusencia, string> = {
  fuera_del_aula: "Fuera del aula",
  desayunando: "Desayunando",
  servicios_higienicos: "Servicios higiénicos",
  uso_celular: "Uso de celular",
  otro: "Otro",
};

/**
 * Opciones para selectores en formularios de registro y filtros.
 */
export const OPCIONES_MOTIVO_AUSENCIA = MOTIVOS_AUSENCIA.map((motivo) => ({
  value: motivo,
  label: ETIQUETAS_MOTIVO_AUSENCIA[motivo],
}));
