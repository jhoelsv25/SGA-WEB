import type { TipoMarcacion, TurnoInfo } from "../types";

/**
 * Detecta el turno escolar activo y sugiere de forma inteligente si la marcación
 * actual corresponde a entrada o salida según la hora del reloj del sistema.
 *
 * @param fecha Fecha y hora de referencia (por defecto la hora actual).
 */
export function detectarTurnoSugerido(fecha = new Date()): TurnoInfo {
  const hora = fecha.getHours();
  const minutos = fecha.getMinutes();
  const minutosTotales = hora * 60 + minutos;

  // Turno Mañana: 07:30 - 13:30
  if (minutosTotales >= 6 * 60 && minutosTotales < 12 * 60) {
    return {
      nombre: "Turno Mañana",
      horario: "08:00 – 13:00",
      tipoSugerido: "entrada",
    };
  }

  // Intervalo de salida de la mañana / cambio de turno: 12:00 - 13:45
  if (minutosTotales >= 12 * 60 && minutosTotales < 13 * 60 + 45) {
    return {
      nombre: "Turno Mañana (Salida)",
      horario: "08:00 – 13:00",
      tipoSugerido: "salida",
    };
  }

  // Turno Tarde (Entrada): 13:45 - 16:30
  if (minutosTotales >= 13 * 60 + 45 && minutosTotales < 16 * 60 + 30) {
    return {
      nombre: "Turno Tarde",
      horario: "14:00 – 18:30",
      tipoSugerido: "entrada",
    };
  }

  // Turno Tarde (Salida): 16:30 - 20:30
  if (minutosTotales >= 16 * 60 + 30 && minutosTotales < 20 * 60 + 30) {
    return {
      nombre: "Turno Tarde (Salida)",
      horario: "14:00 – 18:30",
      tipoSugerido: "salida",
    };
  }

  // Horario Extendido / Noche
  const sugerencia: TipoMarcacion = hora < 12 ? "entrada" : "salida";
  return {
    nombre: "Horario Especial",
    horario: "Atención Continua",
    tipoSugerido: sugerencia,
  };
}
