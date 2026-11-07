import { PALETAS_AREA, ESTILO_CURSO_DEFAULT, type EstiloCursoPaleta } from "../consts";

/**
 * Determina el degradado visual y acento temático de un curso o materia
 * a partir de su área curricular o nombre.
 */
export function obtenerEstiloCurso(curso: {
  cursoNombre: string;
  colorHex?: string | null;
  areaCurricular?: string | null;
}): EstiloCursoPaleta {
  const nombre = (curso.areaCurricular || curso.cursoNombre || "").toLowerCase();

  for (const [clave, estilo] of Object.entries(PALETAS_AREA)) {
    if (nombre.includes(clave.replace("_", " ")) || nombre.includes(clave)) {
      return estilo;
    }
  }

  if (nombre.includes("mat")) return PALETAS_AREA.matematica;
  if (nombre.includes("comunic")) return PALETAS_AREA.comunicacion;
  if (nombre.includes("ingl")) return PALETAS_AREA.ingles;
  if (nombre.includes("arte") || nombre.includes("cultura")) return PALETAS_AREA.arte_cultura;
  if (nombre.includes("social") || nombre.includes("historia") || nombre.includes("geografia")) {
    return PALETAS_AREA.ciencias_sociales;
  }
  if (nombre.includes("ciencia") || nombre.includes("tecnolog") || nombre.includes("quimica")) {
    return PALETAS_AREA.ciencia_tecnologia;
  }
  if (nombre.includes("fisica") || nombre.includes("deporte")) return PALETAS_AREA.educacion_fisica;
  if (nombre.includes("religion") || nombre.includes("religios"))
    return PALETAS_AREA.educacion_religiosa;
  if (nombre.includes("trabajo") || nombre.includes("computacion") || nombre.includes("ept")) {
    return PALETAS_AREA.educacion_trabajo;
  }
  if (nombre.includes("tutor")) return PALETAS_AREA.tutoría;

  return ESTILO_CURSO_DEFAULT;
}
