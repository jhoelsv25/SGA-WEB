import {
  differenceInMinutes,
  format,
  formatDistanceToNow,
  isSameYear,
  isToday,
  isYesterday,
  isValid,
  parseISO,
} from "date-fns";
import { es } from "date-fns/locale";

function toValidDate(value: Date | string | number | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isValid(value) ? value : null;
  if (typeof value === "number") {
    const d = new Date(value);
    return isValid(d) ? d : null;
  }
  let str = value.trim();
  // Si la fecha viene como timestamp SQL sin indicador de zona horaria (ej. "2026-10-07 23:54:20"),
  // dado que el backend/DB almacena en UTC, añadimos "Z" para que date-fns/navegador
  // la convierta fielmente a la hora local del usuario (ej. Lima GMT-5 -> 18:54).
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?/.test(str)) {
    if (!str.endsWith("Z") && !str.includes("+") && !/-\d{2}:\d{2}$/.test(str)) {
      str = str.replace(" ", "T") + "Z";
    }
  }
  const date = parseISO(str);
  return isValid(date) ? date : null;
}

/**
 * Formatea una fecha según el patrón especificado (por defecto: 'dd/MM/yyyy').
 * Ejemplo: formatDate("2026-09-04") -> "04/09/2026"
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  pattern = "dd/MM/yyyy",
  fallback = "-",
): string {
  const validDate = toValidDate(date);
  if (!validDate) return fallback;
  return format(validDate, pattern, { locale: es });
}

/**
 * Formatea fecha y hora.
 * Ejemplo: formatDateTime("2026-09-04T10:30:00") -> "04/09/2026 10:30"
 */
export function formatDateTime(
  date: Date | string | number | null | undefined,
  pattern = "dd/MM/yyyy HH:mm",
  fallback = "-",
): string {
  return formatDate(date, pattern, fallback);
}

/**
 * Formato de fecha legible/amigable en español.
 * Ejemplo: "4 de septiembre de 2026"
 */
export function formatDateLong(
  date: Date | string | number | null | undefined,
  fallback = "-",
): string {
  return formatDate(date, "d 'de' MMMM 'de' yyyy", fallback);
}

/**
 * Retorna el tiempo relativo desde la fecha indicada hasta ahora.
 * Ejemplo: "hace 5 minutos", "hace 2 días"
 */
export function formatRelativeTime(
  date: Date | string | number | null | undefined,
  fallback = "-",
): string {
  const validDate = toValidDate(date);
  if (!validDate) return fallback;
  return formatDistanceToNow(validDate, { addSuffix: true, locale: es });
}

/**
 * Formatea la hora de envío de un mensaje individual de chat.
 * Ejemplo: "10:45 AM" o "14:20"
 */
export function formatChatMessageTime(
  date: Date | string | number | null | undefined,
  options: { use12Hour?: boolean; fallback?: string } = {},
): string {
  const { use12Hour = true, fallback = "" } = options;
  const validDate = toValidDate(date);
  if (!validDate) return fallback;

  return format(validDate, use12Hour ? "hh:mm a" : "HH:mm", { locale: es });
}

/**
 * Formatea el timestamp de la lista de conversaciones (estilo WhatsApp / Messenger).
 * - Si es de hoy: "10:30 AM"
 * - Si fue ayer: "Ayer"
 * - Si fue esta semana o año actual: "04/09"
 * - Si es de otro año: "04/09/2025"
 */
export function formatChatConversationTime(
  date: Date | string | number | null | undefined,
  fallback = "",
): string {
  const validDate = toValidDate(date);
  if (!validDate) return fallback;

  if (isToday(validDate)) {
    return format(validDate, "hh:mm a", { locale: es });
  }

  if (isYesterday(validDate)) {
    return "Ayer";
  }

  if (isSameYear(validDate, new Date())) {
    return format(validDate, "dd/MM", { locale: es });
  }

  return format(validDate, "dd/MM/yyyy", { locale: es });
}

/**
 * Formatea el separador de fecha entre grupos de mensajes dentro de un chat.
 * - Si es hoy: "Hoy"
 * - Si es ayer: "Ayer"
 * - Mismo año: "Viernes, 4 de septiembre"
 * - Otro año: "4 de septiembre de 2025"
 */
export function formatChatDividerDate(
  date: Date | string | number | null | undefined,
  fallback = "",
): string {
  const validDate = toValidDate(date);
  if (!validDate) return fallback;

  if (isToday(validDate)) {
    return "Hoy";
  }

  if (isYesterday(validDate)) {
    return "Ayer";
  }

  if (isSameYear(validDate, new Date())) {
    return format(validDate, "EEEE, d 'de' MMMM", { locale: es });
  }

  return format(validDate, "d 'de' MMMM 'de' yyyy", { locale: es });
}

/**
 * Formatea el estado de conexión o última vez visto de un usuario o contacto.
 * - Hace menos de 2 minutos: "En línea"
 * - Hoy: "Últ. vez hoy a las 10:15 AM"
 * - Ayer: "Últ. vez ayer a las 08:30 PM"
 * - Otro día: "Últ. vez el 02/09/2026 a las 11:00 AM"
 */
export function formatLastSeen(
  date: Date | string | number | null | undefined,
  options: { onlineThresholdMinutes?: number; fallback?: string } = {},
): string {
  const { onlineThresholdMinutes = 2, fallback = "Desconectado" } = options;
  const validDate = toValidDate(date);
  if (!validDate) return fallback;

  const now = new Date();
  const diffMinutes = Math.abs(differenceInMinutes(now, validDate));

  if (diffMinutes <= onlineThresholdMinutes) {
    return "En línea";
  }

  const timeStr = format(validDate, "hh:mm a", { locale: es });

  if (isToday(validDate)) {
    return `Últ. vez hoy a las ${timeStr}`;
  }

  if (isYesterday(validDate)) {
    return `Últ. vez ayer a las ${timeStr}`;
  }

  if (isSameYear(validDate, now)) {
    const dateStr = format(validDate, "d 'de' MMMM", { locale: es });
    return `Últ. vez el ${dateStr} a las ${timeStr}`;
  }

  const fullDateStr = format(validDate, "dd/MM/yyyy", { locale: es });
  return `Últ. vez el ${fullDateStr} a las ${timeStr}`;
}
