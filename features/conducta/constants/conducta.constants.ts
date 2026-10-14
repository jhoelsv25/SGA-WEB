import type { SelectOptionItem } from "@/components/common/select";
import type { GravedadFalta, TipoObservacion } from "../types";

export const CATEGORIAS_SUGERIDAS_MERITO: string[] = [
  "Participación destacada",
  "Solidaridad y compañerismo",
  "Puntualidad impecable",
  "Liderazgo positivo",
  "Cuidado del medio ambiente",
];

export const CATEGORIAS_SUGERIDAS_FALTA: string[] = [
  "Uniforme escolar",
  "Puntualidad",
  "Uso no autorizado de celular",
  "Interrupción reiterada de clase",
  "Falta de respeto a compañeros",
  "Daño a infraestructura",
];

export const OPCIONES_GRAVEDAD: SelectOptionItem<GravedadFalta>[] = [
  { value: "leve", label: "Falta Leve" },
  { value: "grave", label: "Falta Grave" },
  { value: "muy_grave", label: "Falta Muy Grave" },
];

export const OPCIONES_TIPO_OBSERVACION: SelectOptionItem<TipoObservacion>[] = [
  { value: "academica", label: "Académica" },
  { value: "conductual", label: "Conductual" },
  { value: "socioemocional", label: "Socioemocional" },
  { value: "salud", label: "Salud" },
  { value: "familiar", label: "Familiar" },
];
