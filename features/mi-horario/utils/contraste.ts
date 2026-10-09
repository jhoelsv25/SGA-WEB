/**
 * Utilidades para cálculo de contraste WCAG 2.1 nivel AA sobre colores de cursos.
 */

/**
 * Calcula la luminancia relativa de un color hexadecimal (#RRGGBB).
 */
export function calcularLuminancia(hex: string): number {
  const limpio = hex.replace("#", "");
  if (limpio.length !== 6) return 0.5;

  const r = parseInt(limpio.slice(0, 2), 16) / 255;
  const g = parseInt(limpio.slice(2, 4), 16) / 255;
  const b = parseInt(limpio.slice(4, 6), 16) / 255;

  const aR = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const aG = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const aB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  return 0.2126 * aR + 0.7152 * aG + 0.0722 * aB;
}

/**
 * Retorna las propiedades de estilo que garantizan contraste AA (relación >= 4.5:1)
 * para texto sobre el color de fondo asignado al curso escolar.
 */
export function obtenerEstilosContraste(colorFondoHex?: string | null) {
  if (!colorFondoHex || !/^#[0-9A-Fa-f]{6}$/.test(colorFondoHex)) {
    return {
      colorTexto: "currentColor",
      colorSecundario: "currentColor",
      colorBorde: "currentColor",
      fondoEstilo: undefined,
    };
  }

  const luminancia = calcularLuminancia(colorFondoHex);
  // Contraste con blanco (#ffffff, L = 1.0)
  const contrasteBlanco = 1.05 / (luminancia + 0.05);
  // Contraste con texto oscuro (#0f172a, L ≈ 0.01)
  const contrasteOscuro = (luminancia + 0.05) / 0.06;

  const usarTextoClaro = contrasteBlanco >= contrasteOscuro;

  return {
    colorTexto: usarTextoClaro ? "#ffffff" : "#0f172a",
    colorSecundario: usarTextoClaro ? "rgba(255, 255, 255, 0.88)" : "rgba(15, 23, 42, 0.82)",
    colorBorde: usarTextoClaro ? "rgba(255, 255, 255, 0.3)" : "rgba(15, 23, 42, 0.25)",
    fondoEstilo: {
      backgroundColor: colorFondoHex,
    },
  };
}
