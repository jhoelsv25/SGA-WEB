import type { StatusBadgeTone } from "@/components/common/status-badge";
import type { EstadoAnio, EstadoBimestre } from "../../types";

export const ESTADO_ANIO: Record<EstadoAnio, string> = {
  planificado: "Planificado",
  en_curso: "En curso",
  cerrado: "Cerrado",
  reabierto: "Reabierto",
};

export const TONO_ESTADO_ANIO: Record<EstadoAnio, StatusBadgeTone> = {
  en_curso: "success",
  planificado: "info",
  cerrado: "neutral",
  reabierto: "warning",
};

export const ESTADO_BIMESTRE: Record<EstadoBimestre, string> = {
  planificado: "Planificado",
  en_curso: "En curso",
  cerrado: "Cerrado",
};

export const TONO_ESTADO_BIMESTRE: Record<EstadoBimestre, StatusBadgeTone> = {
  en_curso: "success",
  planificado: "info",
  cerrado: "neutral",
};
