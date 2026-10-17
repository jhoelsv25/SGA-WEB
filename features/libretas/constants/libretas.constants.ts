import { formatDate } from "@/lib/formatters/date";
import type { AlcanceLibreta, EstadoLibreta } from "../types";

export const MAX_ARCHIVOS = 50;
export const MAX_BYTES_PDF = 5 * 1024 * 1024;

export const LIBRETAS_ENDPOINTS = {
  BASE: "/libretas",
  CONTEXTO: "/libretas/contexto",
  PROGRAMAR: "/libretas/programar",
  PROGRAMACIONES: (periodoId: string) => `/libretas/programaciones/${periodoId}`,
  VISTA_PREVIA: "/libretas/vista-previa",
  PUBLICAR: "/libretas/publicar",
  ALCANCES: "/libretas/alcances",
  SEGUIMIENTO: "/libretas/seguimiento",
  DETALLE: (seccionId: string) => `/libretas/seguimiento/${seccionId}`,
  MIAS: "/libretas/mias",
  HISTORIAL: (id: string) => `/libretas/${id}/historial`,
  ARCHIVO: (id: string) => `/libretas/${id}/archivo`,
} as const;

export const ETIQUETA_ESTADO: Record<EstadoLibreta, string> = {
  pendiente: "Pendiente",
  a_tiempo: "A tiempo",
  fuera_de_plazo: "Fuera de plazo",
};

export const ETIQUETA_ALCANCE: Record<AlcanceLibreta, string> = {
  tutoria: "Tutoría",
  mis_secciones: "Mis secciones",
  colegio: "Todo el colegio",
};

export const OPCIONES_ALCANCE: { value: AlcanceLibreta; label: string }[] = [
  { value: "tutoria", label: "Tutoría" },
  { value: "mis_secciones", label: "Mis secciones" },
  { value: "colegio", label: "Todo el colegio" },
];

export function tituloBimestre(nombre: string): string {
  const limpio = nombre.trim();
  if (/bimestre/i.test(limpio)) return limpio;
  return `Bimestre ${limpio}`;
}

export function formatearFecha(valor: string | null | undefined): string {
  if (!valor) return "—";
  return formatDate(valor, "dd/MM/yyyy");
}

export function aFechaIso(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

export function desdeFechaIso(valor: string): Date {
  const [anio, mes, dia] = valor.slice(0, 10).split("-").map(Number);
  return new Date(anio, (mes ?? 1) - 1, dia ?? 1);
}
