/**
 * Obtiene las iniciales en mayúsculas a partir de un nombre o razón social.
 * Maneja valores nulos, espacios múltiples y limita la cantidad de caracteres.
 *
 * @example
 * getInitials("Juan Pérez") // "JP"
 * getInitials("SISTEMAS") // "S"
 * getInitials("Empresa de Transportes del Sur", 2) // "ET"
 * getInitials(null) // ""
 */
export function getInitials(name?: string | null, maxInitials = 2): string {
  if (!name || typeof name !== "string") return "";
  const trimmed = name.trim();
  if (!trimmed) return "";

  return trimmed
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, maxInitials)
    .join("")
    .toUpperCase();
}
