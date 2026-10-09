/**
 * Utilidades de formato para la interfaz del Kiosko de Marcación.
 */

/**
 * Extrae de forma natural el primer nombre y el primer apellido de una persona,
 * respetando partículas comunes en apellidos hispanos (de, del, la, de la, san, etc.).
 *
 * @example
 * extraerPrimerNombreYApellido("Rosa Quispe Flores") // "Rosa Quispe"
 * extraerPrimerNombreYApellido("Juan Carlos Pérez Gómez") // "Juan Pérez"
 * extraerPrimerNombreYApellido("María de la Cruz Flores") // "María de la Cruz"
 */
export function extraerPrimerNombreYApellido(nombreCompleto: string): string {
  if (!nombreCompleto) return "";
  const limpio = nombreCompleto.trim();
  if (!limpio) return "";

  const palabras = limpio.split(/\s+/).filter(Boolean);
  if (palabras.length <= 1) return palabras[0] ?? "";
  if (palabras.length === 2) return `${palabras[0]} ${palabras[1]}`;

  const particulas = new Set(["de", "del", "la", "las", "los", "san", "santa"]);

  // Caso típico de 4 palabras: "Juan Carlos Pérez Gómez" -> "Juan Pérez"
  if (palabras.length === 4) {
    if (particulas.has(palabras[1].toLowerCase())) {
      // ej: "Juan de la Cruz Gómez"
      return `${palabras[0]} ${palabras[1]} ${palabras[2]} ${palabras[3]}`;
    }
    if (particulas.has(palabras[2].toLowerCase())) {
      // ej: "Juan Carlos del Solar Gómez"
      return `${palabras[0]} ${palabras.slice(2, 4).join(" ")}`;
    }
    // Nombre1 Nombre2 ApellidoPaterno ApellidoMaterno -> Nombre1 ApellidoPaterno
    return `${palabras[0]} ${palabras[2]}`;
  }

  // Caso típico de 3 palabras: "Rosa Quispe Flores" -> "Rosa Quispe"
  if (palabras.length === 3) {
    if (particulas.has(palabras[1].toLowerCase())) {
      // ej: "Rosa del Solar"
      return `${palabras[0]} ${palabras[1]} ${palabras[2]}`;
    }
    return `${palabras[0]} ${palabras[1]}`;
  }

  // Caso de más palabras
  const primerNombre = palabras[0];
  let indiceApellido = 2;
  if (particulas.has(palabras[1].toLowerCase())) {
    indiceApellido = 1;
  }

  const partesApellido: string[] = [];
  let i = indiceApellido;
  while (i < palabras.length && particulas.has(palabras[i].toLowerCase())) {
    partesApellido.push(palabras[i]);
    i++;
  }
  if (i < palabras.length) {
    partesApellido.push(palabras[i]);
  }

  return `${primerNombre} ${partesApellido.join(" ")}`.trim();
}

/**
 * Formatea una fecha a hora con segundos para el reloj digital de portería.
 */
export function formatearHora(fecha: Date): string {
  return new Intl.DateTimeFormat("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(fecha);
}

/**
 * Formatea una fecha al formato largo peruano (ej. "miércoles, 8 de octubre de 2026").
 */
export function formatearFecha(fecha: Date): string {
  return new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(fecha);
}
