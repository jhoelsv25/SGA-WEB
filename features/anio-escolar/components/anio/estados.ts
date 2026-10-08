import type { EstadoAnio, EstadoBimestre } from "../../types";

export const ESTADO_ANIO: Record<EstadoAnio, string> = {
  planificado: "Planificado",
  en_curso: "En curso",
  cerrado: "Cerrado",
  reabierto: "Reabierto",
};

export const ESTADO_BIMESTRE: Record<EstadoBimestre, string> = {
  planificado: "Planificado",
  en_curso: "En curso",
  cerrado: "Cerrado",
};
