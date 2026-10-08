import type { EventoCalendario } from "./types";

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export function formatoFecha(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [anio, mes, dia] = iso.slice(0, 10).split("-");
  if (!anio || !mes || !dia) return iso;
  return `${dia}/${mes}/${anio}`;
}

export function tituloMes(anio: number, mes: number): string {
  const nombre = MESES[mes - 1] ?? "";
  return `${nombre.charAt(0).toUpperCase()}${nombre.slice(1)} ${anio}`;
}

export function desplazarMes(
  anio: number,
  mes: number,
  delta: number,
): { anio: number; mes: number } {
  const fecha = new Date(anio, mes - 1 + delta, 1);
  return { anio: fecha.getFullYear(), mes: fecha.getMonth() + 1 };
}

export function isoDePartes(anio: number, mes: number, dia: number): string {
  return `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

export function fechaDeIso(iso: string | null | undefined): Date | undefined {
  if (!iso) return undefined;
  const [anio, mes, dia] = iso.slice(0, 10).split("-").map(Number);
  if (!anio || !mes || !dia) return undefined;
  return new Date(anio, mes - 1, dia);
}

export function isoDeFecha(fecha: Date | undefined): string {
  if (!fecha) return "";
  return isoDePartes(fecha.getFullYear(), fecha.getMonth() + 1, fecha.getDate());
}

export interface FiltroEventos {
  busqueda: string;
  tipo: string;
  clases: string;
}

export function filtrarEventos(
  eventos: EventoCalendario[],
  filtro: FiltroEventos,
): EventoCalendario[] {
  const busqueda = filtro.busqueda.trim().toLowerCase();
  return eventos.filter((evento) => {
    if (busqueda && !evento.titulo.toLowerCase().includes(busqueda)) return false;
    if (filtro.tipo && filtro.tipo !== "all" && evento.tipo !== filtro.tipo) return false;
    if (filtro.clases === "si" && !evento.suspendeClases) return false;
    if (filtro.clases === "no" && evento.suspendeClases) return false;
    return true;
  });
}

function sumarDia(iso: string): string {
  const [anio, mes, dia] = iso.split("-").map(Number);
  const siguiente = new Date(anio, mes - 1, dia + 1);
  return isoDePartes(siguiente.getFullYear(), siguiente.getMonth() + 1, siguiente.getDate());
}

/** Días del rango en los que un evento filtrado suspende clases. */
export function diasSinClasesDe(
  eventos: EventoCalendario[],
  desde: string,
  hasta: string,
): string[] {
  const dias = new Set<string>();
  for (const evento of eventos) {
    if (!evento.suspendeClases) continue;
    const inicio = evento.fechaInicio > desde ? evento.fechaInicio : desde;
    const fin = evento.fechaFin < hasta ? evento.fechaFin : hasta;
    let cursor = inicio;
    while (cursor <= fin) {
      dias.add(cursor);
      cursor = sumarDia(cursor);
    }
  }
  return [...dias].sort();
}
