import type { GuardarPlanificacionPayload } from "../types";
import { sumaMinutos } from "./index";

export type ClaveSeccion = "datos" | "competencias" | "evaluacion" | "secuencia" | "referencias";

export interface EstadoSeccion {
  clave: ClaveSeccion;
  etiqueta: string;
  listo: boolean;
}

const lleno = (t?: string | null) => Boolean(t && t.trim());

/** Qué secciones obligatorias de la sesión ya están completas, con palabras sencillas. */
export function estadoSecciones(
  f: GuardarPlanificacionPayload,
  minutosBloque: number,
): EstadoSeccion[] {
  const competencias = (f.competencias ?? []).filter((c) => c.competenciaId);
  const momentos = f.momentos ?? [];
  const todosLlenos = ["inicio", "desarrollo", "cierre"].every((m) =>
    lleno(momentos.find((x) => x.momento === m)?.actividades),
  );
  return [
    {
      clave: "datos",
      etiqueta: "Título y propósito",
      listo: lleno(f.titulo) && lleno(f.proposito),
    },
    {
      clave: "competencias",
      etiqueta: "Competencia y desempeños",
      listo: competencias.length > 0 && competencias.every((c) => c.desempenos.length > 0),
    },
    {
      clave: "evaluacion",
      etiqueta: "Evidencia, criterios e instrumento",
      listo:
        lleno(f.evidencia) &&
        (f.criterios ?? []).some((c) => lleno(c)) &&
        lleno(f.instrumentoCodigo),
    },
    {
      clave: "secuencia",
      etiqueta: "Inicio, desarrollo y cierre",
      listo: todosLlenos && sumaMinutos(momentos) === minutosBloque,
    },
    {
      clave: "referencias",
      etiqueta: "Referencias",
      listo: (f.referencias ?? []).some((r) => lleno(r)),
    },
  ];
}
