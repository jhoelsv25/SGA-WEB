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
    momentos: p.momentos.map((m) => ({
      momento: m.momento,
      actividades: m.actividades ?? undefined,
      minutos: m.minutos ?? undefined,
    })),
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
