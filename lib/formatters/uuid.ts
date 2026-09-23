/**
 * Genera un UUID v4 compatible con navegadores y Node.js.
 */
export function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback para entornos donde crypto.randomUUID no esté disponible
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

/**
 * Valida si un string cumple con el formato UUID v4 estándar.
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Trunca un UUID o hash para mostrarlo compacto en tablas/UI.
 * Ejemplo: truncateUUID("123e4567-e89b-12d3-a456-426614174000") -> "123e...4000"
 */
export function truncateUUID(uuid: string, chars = 4): string {
  if (!uuid) return "-";
  if (uuid.length <= chars * 2) return uuid;
  return `${uuid.slice(0, chars)}...${uuid.slice(-chars)}`;
}
