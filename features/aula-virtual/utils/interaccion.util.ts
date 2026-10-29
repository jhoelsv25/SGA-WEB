import { formatDate } from "@/lib/formatters/date";
import { LIMITE_ADJUNTO_BYTES, LIMITE_EDICION_MS } from "../consts";

/**
 * Valida si una publicación o comentario se encuentra dentro del plazo de 15 minutos para ser editado.
 */
export function sePuedeEditar(creadoEn: string): boolean {
  const diff = Date.now() - new Date(creadoEn).getTime();
  return diff <= LIMITE_EDICION_MS;
}

/**
 * Valida que el archivo no supere el tamaño máximo permitido de 10 MB.
 */
export function esTamanoValido(file: File): boolean {
  return file.size <= LIMITE_ADJUNTO_BYTES;
}

/**
 * Valida que el archivo adjunto en el muro o chat sea imagen o PDF.
 */
export function esFormatoAdjuntoValido(file: File): boolean {
  const nombre = file.name.toLowerCase();
  return (
    nombre.endsWith(".pdf") ||
    nombre.endsWith(".png") ||
    nombre.endsWith(".jpg") ||
    nombre.endsWith(".jpeg") ||
    nombre.endsWith(".webp") ||
    nombre.endsWith(".gif")
  );
}

/**
 * Formatea una fecha ISO en hora legible (HH:mm).
 */
export function formatearHora(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

/**
 * Formatea una fecha ISO en formato completo "DD/MM/YYYY HH:mm".
 */
export function formatearFechaHora(iso: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return `${formatDate(d)} ${formatearHora(iso)}`;
  } catch {
    return iso;
  }
}

/**
 * Convierte un identificador o número romano de bimestre (ej. "I", "II")
 * en una etiqueta descriptiva y legible como "I Bimestre", "II Bimestre".
 */
export function formatearBimestre(nombre: string | null | undefined): string {
  if (!nombre) return "";
  const trim = nombre.trim();
  if (/bimestre/i.test(trim)) return trim;
  return `${trim} Bimestre`;
}
