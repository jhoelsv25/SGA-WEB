import type { GuardarPlanificacionPayload, Momento, Planificacion } from "../types";

export const DIAS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] as const;

export const MOMENTOS_ORDEN: Momento[] = ["inicio", "desarrollo", "cierre"];

/** Minutos del bloque a partir de "HH:MM[:SS]". */
export function minutosDeBloque(horaInicio: string, horaFin: string): number {
  const aMin = (h: string) => {
    const [hh, mm] = h.split(":").map(Number);
    return (hh ?? 0) * 60 + (mm ?? 0);
  };
  return aMin(horaFin) - aMin(horaInicio);
}

export function sumaMinutos(momentos: { minutos?: number | null }[]): number {
  return momentos.reduce((t, m) => t + (m.minutos ?? 0), 0);
}

/** Lunes de la semana de una fecha ISO (yyyy-mm-dd), sin zona horaria. */
export function desplazarSemana(fechaIso: string, semanas: number): string {
  const [a, m, d] = fechaIso.split("-").map(Number);
  const f = new Date(Date.UTC(a ?? 1970, (m ?? 1) - 1, d ?? 1));
  f.setUTCDate(f.getUTCDate() + semanas * 7);
  return f.toISOString().slice(0, 10);
}

export function hoyIso(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function recortarHora(h: string): string {
  return h.slice(0, 5);
}

/** Convierte una planificación guardada en el estado editable del formulario. */
export function aPayload(p: Planificacion): GuardarPlanificacionPayload {
  return {
    horarioId: p.horarioId,
    fecha: p.fecha,
    numero: p.numero ?? undefined,
    unidad: p.unidad ?? undefined,
    titulo: p.titulo,
    proposito: p.proposito ?? undefined,
    evidencia: p.evidencia ?? undefined,
    criterios: p.criterios,
    instrumentoCodigo: p.instrumentoCodigo ?? undefined,
    competencias: p.competencias.map((c) => ({
      competenciaId: c.competenciaId,
      capacidades: c.capacidades,
      desempenos: c.desempenos.map((d) => ({
        desempenoId: d.desempenoId ?? undefined,
        texto: d.texto,
      })),
      campoTematico: c.campoTematico ?? undefined,
    })),
    competenciasTransversales: p.competenciasTransversales,
    enfoques: p.enfoques,
    materiales: p.materiales,
    referencias: p.referencias,
    producto: p.producto ?? undefined,
    coordinador: p.coordinador ?? undefined,
    acuerdos: p.acuerdos,
    mapaVisual: p.mapaVisual,
    seccionesAdicionales: p.seccionesAdicionales,
    momentos: p.momentos.map((m) => ({
      momento: m.momento,
      actividades: m.actividades ?? undefined,
      minutos: m.minutos ?? undefined,
    })),
  };
}

/**
 * Lo que se envía al guardar: sin competencias sin elegir ni viñetas vacías (la API exige texto en
 * cada desempeño y guardaría tal cual las viñetas vacías de materiales).
 */
export function limpiarPayload(f: GuardarPlanificacionPayload): GuardarPlanificacionPayload {
  const llenas = (l?: string[]) => l?.map((x) => x.trim()).filter(Boolean);
  return {
    ...f,
    criterios: llenas(f.criterios),
    referencias: llenas(f.referencias),
    acuerdos: llenas(f.acuerdos),
    mapaVisual: f.mapaVisual?.filter((c) => c.concepto.trim() || c.definicion.trim()),
    enfoques: f.enfoques?.map((e) => ({ ...e, acciones: llenas(e.acciones) ?? [] })),
    materiales: f.materiales && {
      impresos: llenas(f.materiales.impresos),
      manipulativos: llenas(f.materiales.manipulativos),
      digitales: llenas(f.materiales.digitales),
      recursos: llenas(f.materiales.recursos),
      comunidad: llenas(f.materiales.comunidad),
    },
    competencias: (f.competencias ?? [])
      .filter((c) => c.competenciaId)
      .map((c) => ({ ...c, desempenos: c.desempenos.filter((d) => d.texto.trim()) })),
  };
}

export function guardarArchivo(blob: Blob, nombre: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}

export function desplazarDias(fechaIso: string, dias: number): string {
  const [a, m, d] = fechaIso.split("-").map(Number);
  const f = new Date(Date.UTC(a ?? 1970, (m ?? 1) - 1, d ?? 1));
  f.setUTCDate(f.getUTCDate() + dias);
  return f.toISOString().slice(0, 10);
}

/** Lunes de la semana de una fecha ISO. */
export function lunesDeFecha(fechaIso: string): string {
  const [a, m, d] = fechaIso.split("-").map(Number);
  const dia = new Date(Date.UTC(a ?? 1970, (m ?? 1) - 1, d ?? 1)).getUTCDay() || 7;
  return desplazarDias(fechaIso, -(dia - 1));
}

export interface SemanaDeBimestre {
  numero: number;
  desde: string;
  hasta: string;
}

/** Semanas (lunes a viernes) que cubre un bimestre, numeradas desde 1. */
export function semanasDeBimestre(fechaInicio: string, fechaFin: string): SemanaDeBimestre[] {
  const fin = fechaFin.slice(0, 10);
  const semanas: SemanaDeBimestre[] = [];
  let lunes = lunesDeFecha(fechaInicio.slice(0, 10));
  while (lunes <= fin) {
    semanas.push({ numero: semanas.length + 1, desde: lunes, hasta: desplazarDias(lunes, 6) });
    lunes = desplazarDias(lunes, 7);
  }
  return semanas;
}
export * from "./progreso";
export * from "./documento";
