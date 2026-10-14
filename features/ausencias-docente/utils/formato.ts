import { VALORES_DEFECTO_AUSENCIA } from "../consts";

/**
 * Calcula la diferencia en minutos entre dos horas en formato "HH:mm".
 * Si la hora final es menor o igual a la inicial o el formato es inválido, retorna 0.
 */
export function calcularMinutosEntre(horaDesde: string, horaHasta: string): number {
  if (!horaDesde || !horaHasta) return 0;

  const regexHora = /^([01]\d|2[0-3]):[0-5]\d$/;
  if (!regexHora.test(horaDesde) || !regexHora.test(horaHasta)) {
    return 0;
  }

  const [horasDesde, minsDesde] = horaDesde.split(":").map(Number);
  const [horasHasta, minsHasta] = horaHasta.split(":").map(Number);

  const totalInicio = horasDesde * 60 + minsDesde;
  const totalFin = horasHasta * 60 + minsHasta;

  const diferencia = totalFin - totalInicio;
  return diferencia > 0 ? diferencia : 0;
}

/**
 * Formatea una cantidad de minutos en texto descriptivo para el usuario.
 * Ejemplos: 20 -> "20 min", 60 -> "1 h", 90 -> "1 h 30 min".
 */
export function formatearMinutos(minutos: number): string {
  if (minutos <= 0) return "0 min";
  if (minutos < 60) return `${minutos} min`;

  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;

  if (minutosRestantes === 0) {
    return `${horas} h`;
  }
  return `${horas} h ${minutosRestantes} min`;
}

/**
 * Formatea una fecha ISO o "YYYY-MM-DD" a formato legible "DD/MM/YYYY".
 * Descompone directamente año, mes y día de la cadena para evitar desfases por zona horaria (UTC-5).
 */
export function formatearFechaLimite(fechaIso?: string | null): string {
  if (!fechaIso) return "-";

  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})/.exec(fechaIso.trim());
  if (coincidencia) {
    const [, anio, mes, dia] = coincidencia;
    return `${dia}/${mes}/${anio}`;
  }

  return "-";
}

/**
 * Determina si una ausencia puede ser corregida según sus condiciones de vigencia,
 * ausencia de descargo y plazo de 24 horas transcurridas desde su registro.
 */
export function esAusenciaCorregible(
  ausencia: {
    vigente: boolean;
    anulada: boolean;
    descargo: string | null;
    registradoEn: string;
  },
  plazoHoras: number = VALORES_DEFECTO_AUSENCIA.PLAZO_CORRECCION_HORAS,
): boolean {
  if (!ausencia.vigente || ausencia.anulada || ausencia.descargo !== null) {
    return false;
  }

  const fechaRegistro = new Date(ausencia.registradoEn).getTime();
  if (isNaN(fechaRegistro)) return false;

  const horasTranscurridas = (Date.now() - fechaRegistro) / (1000 * 60 * 60);
  return horasTranscurridas <= plazoHoras;
}

/**
 * Determina si el docente todavía puede presentar su descargo para una ausencia.
 */
export function esDescargoPermitido(ausencia: {
  vigente: boolean;
  anulada: boolean;
  descargo: string | null;
  fechaLimiteDescargo: string | null;
}): boolean {
  if (!ausencia.vigente || ausencia.anulada || ausencia.descargo !== null) {
    return false;
  }

  if (!ausencia.fechaLimiteDescargo) {
    return false;
  }

  const fechaLimite = new Date(ausencia.fechaLimiteDescargo).getTime();
  if (isNaN(fechaLimite)) return false;

  return Date.now() <= fechaLimite;
}
