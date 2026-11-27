import type { StatusBadgeTone } from "@/components/common/status-badge/types";
import type { Sesion } from "@/features/sesiones/types";
import type { DiaDePersona, EstadoDia, OrigenMarcacionApi } from "../types";

export const ESTADOS_DIA: Record<
  EstadoDia,
  { label: string; tone: StatusBadgeTone; celda: string }
> = {
  completo: { label: "Entrada y salida", tone: "success", celda: "bg-success/15 text-foreground" },
  en_el_colegio: { label: "En el colegio", tone: "info", celda: "bg-info/15 text-foreground" },
  sin_salida: { label: "Sin salida", tone: "warning", celda: "bg-warning/20 text-foreground" },
  sin_entrada: { label: "Sin entrada", tone: "warning", celda: "bg-warning/20 text-foreground" },
  sin_marca: { label: "Sin marca", tone: "danger", celda: "bg-destructive/15 text-foreground" },
  por_llegar: {
    label: "Aún no es su hora",
    tone: "neutral",
    celda: "bg-muted/60 text-foreground",
  },
  no_corresponde: {
    label: "No corresponde",
    tone: "neutral",
    celda: "bg-muted/60 text-muted-foreground",
  },
};

export const ORIGENES: Record<OrigenMarcacionApi, string> = {
  biometrico: "Reloj biométrico",
  kiosko: "Kiosko",
  manual: "Manual",
  intranet: "Intranet",
};

const ZONA = "America/Lima";

/** Fecha de hoy en el colegio, "YYYY-MM-DD". */
export function hoyEnColegio(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONA }).format(new Date());
}

export function horaActualEnColegio(): string {
  return new Intl.DateTimeFormat("es-PE", {
    timeZone: ZONA,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date());
}

const comoUtc = (fecha: string) => new Date(`${fecha}T12:00:00Z`);

export function sumarDias(fecha: string, dias: number): string {
  const d = comoUtc(fecha);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

export function sumarMeses(mes: string, meses: number): string {
  const d = comoUtc(`${mes}-01`);
  d.setUTCMonth(d.getUTCMonth() + meses);
  return d.toISOString().slice(0, 7);
}

export function fechaLarga(fecha: string): string {
  const texto = new Intl.DateTimeFormat("es-PE", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(comoUtc(fecha));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function nombreDelMes(mes: string): string {
  const texto = new Intl.DateTimeFormat("es-PE", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  }).format(comoUtc(`${mes}-01`));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Columna (0 = lunes) en la que cae el día 1 del mes. */
export function huecosAntesDelDiaUno(mes: string): number {
  return (comoUtc(`${mes}-01`).getUTCDay() + 6) % 7;
}

/** Clase cuyo horario ya empezó (o terminó el día) y no tiene firma de ingreso. */
export function claseSinFirma(sesion: Sesion, hoy: string, ahora: string): boolean {
  if (sesion.horaIngreso) return false;
  if (sesion.estado === "no_cumplida") return true;
  if (sesion.estado !== "pendiente") return false;
  return sesion.fecha < hoy || (sesion.fecha === hoy && sesion.horaInicio < ahora);
}

export function llegoTarde(dia: DiaDePersona): boolean {
  return dia.entrada?.resultado === "tardanza";
}
