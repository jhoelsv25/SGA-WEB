import type { AnioAcademico } from "./types";

export function anioDeReferencia(anios: AnioAcademico[]): AnioAcademico | undefined {
  return (
    anios.find((anio) => anio.estado === "en_curso") ??
    anios.find((anio) => anio.estado === "reabierto")
  );
}

export function sePuedeElegir(anio: AnioAcademico, referencia?: AnioAcademico): boolean {
  if (anio.estado === "planificado") return false;
  if (anio.estado === "en_curso" || anio.estado === "reabierto") return true;
  if (!referencia) return true;
  return anio.anio < referencia.anio;
}
