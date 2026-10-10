export interface EstiloColorContraste {
  color: string;
  backgroundColor: string;
  borderColor?: string;
}

export function getContrasteColor(colorHex: string | null | undefined): EstiloColorContraste {
  if (!colorHex || !/^#[0-9A-Fa-f]{6}$/.test(colorHex)) {
    return {
      color: "var(--primary-foreground)",
      backgroundColor: "var(--primary)",
      borderColor: "transparent",
    };
  }

  const clean = colorHex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  const luminance = (a[0] ?? 0) * 0.2126 + (a[1] ?? 0) * 0.7152 + (a[2] ?? 0) * 0.0722;

  // Si la luminancia es mayor a 0.45, el fondo es claro -> texto oscuro del tema; si no, texto claro del tema.
  const textColor = luminance > 0.45 ? "var(--foreground)" : "var(--primary-foreground)";
  const borderColor = luminance > 0.45 ? "var(--border)" : "transparent";

  return {
    color: textColor,
    backgroundColor: colorHex,
    borderColor,
  };
}

export const DIAS_SEMANA = [
  { dia: 1, nombre: "Lunes", nombreCorto: "Lun" },
  { dia: 2, nombre: "Martes", nombreCorto: "Mar" },
  { dia: 3, nombre: "Miércoles", nombreCorto: "Mié" },
  { dia: 4, nombre: "Jueves", nombreCorto: "Jue" },
  { dia: 5, nombre: "Viernes", nombreCorto: "Vie" },
] as const;

export function nombreDiaSemana(dia: number): string {
  const diaEncontrado = DIAS_SEMANA.find((d) => d.dia === dia);
  return diaEncontrado ? diaEncontrado.nombre : `Día ${dia}`;
}

export function convertirHoraAMinutos(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function minutosAHora(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatearRangoHora(inicio: string, fin: string): string {
  return `${inicio} – ${fin}`;
}
