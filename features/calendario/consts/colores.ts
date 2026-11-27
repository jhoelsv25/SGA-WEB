import type { TipoEvento } from "../types";

/** Un color por tipo de evento, para la cuadrícula y el panel de detalle. */
export const COLOR_EVENTO: Record<TipoEvento, string> = {
  feriado: "bg-destructive",
  suspension: "bg-warning",
  jornada_pedagogica: "bg-info",
  reunion: "bg-primary",
  actividad: "bg-success",
  examen: "bg-violet-600",
};

/** Texto legible sobre cada color relleno. */
export const TEXTO_EVENTO: Record<TipoEvento, string> = {
  feriado: "text-white",
  suspension: "text-warning-foreground",
  jornada_pedagogica: "text-info-foreground",
  reunion: "text-primary-foreground",
  actividad: "text-success-foreground",
  examen: "text-white",
};

/** Casilla de cada tipo con su color, como la lista de calendarios de Google. */
export const CASILLA_EVENTO: Record<TipoEvento, string> = {
  feriado:
    "border-destructive data-checked:border-destructive data-checked:bg-destructive dark:data-checked:bg-destructive",
  suspension:
    "border-warning data-checked:border-warning data-checked:bg-warning dark:data-checked:bg-warning",
  jornada_pedagogica:
    "border-info data-checked:border-info data-checked:bg-info dark:data-checked:bg-info",
  reunion:
    "border-primary data-checked:border-primary data-checked:bg-primary dark:data-checked:bg-primary",
  actividad:
    "border-success data-checked:border-success data-checked:bg-success dark:data-checked:bg-success",
  examen:
    "border-violet-600 data-checked:border-violet-600 data-checked:bg-violet-600 dark:data-checked:bg-violet-600",
};
