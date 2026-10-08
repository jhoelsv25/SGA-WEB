import type { TipoEvento } from "../types";

export const ETIQUETAS_EVENTO: Record<TipoEvento, string> = {
  feriado: "Feriado",
  suspension: "Suspensión",
  jornada_pedagogica: "Jornada pedagógica",
  reunion: "Reunión",
  actividad: "Actividad",
  examen: "Examen",
};
