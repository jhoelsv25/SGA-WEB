import type { FilterCursoParams } from "../types";

export const curriculumKeys = {
  all: ["curriculum"] as const,
  grados: () => [...curriculumKeys.all, "grados"] as const,
  cursos: (filter?: FilterCursoParams) => [...curriculumKeys.all, "cursos", filter] as const,
  planEstudio: (gradoId: string) => [...curriculumKeys.all, "plan-estudio", gradoId] as const,
};
