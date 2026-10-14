import type { EstadoSolicitudFecha } from "../types";

export const aulaKeys = {
  all: ["aula-virtual"] as const,
  cursos: (anioId?: string) => [...aulaKeys.all, anioId ?? "vigente", "cursos"] as const,
  aula: (anioId: string | undefined, id: string) =>
    [...aulaKeys.all, anioId ?? "vigente", "aula", id] as const,
  solicitudes: (anioId: string | undefined, estado?: EstadoSolicitudFecha) =>
    [...aulaKeys.all, anioId ?? "vigente", "solicitudes", estado ?? "todas"] as const,
  seguimiento: (anioId: string | undefined, periodoId?: string) =>
    [...aulaKeys.all, anioId ?? "vigente", "seguimiento", periodoId ?? "en-curso"] as const,
  tareas: (anioId: string | undefined, cursoSeccionId: string, periodoId?: string) =>
    [...aulaKeys.all, anioId ?? "vigente", "tareas", cursoSeccionId, periodoId ?? "todos"] as const,
  tarea: (tareaId: string) => [...aulaKeys.all, "tarea", tareaId] as const,
  entregas: (tareaId: string) => [...aulaKeys.all, "entregas", tareaId] as const,
  libroNotas: (cursoSeccionId: string, periodoId?: string) =>
    [...aulaKeys.all, "libro-notas", cursoSeccionId, periodoId ?? "en-curso"] as const,
  misNotas: (periodoId?: string) => [...aulaKeys.all, "mis-notas", periodoId ?? "todos"] as const,
  muro: (cursoSeccionId: string) => [...aulaKeys.all, "muro", cursoSeccionId] as const,
  comentarios: (publicacionId: string) => [...aulaKeys.all, "comentarios", publicacionId] as const,
  chat: (cursoSeccionId: string) => [...aulaKeys.all, "chat", cursoSeccionId] as const,
  chatNoLeidos: (cursoSeccionId: string) =>
    [...aulaKeys.all, "chat-no-leidos", cursoSeccionId] as const,
  moderacion: (cursoSeccionId: string) => [...aulaKeys.all, "moderacion", cursoSeccionId] as const,
  actividadMaterial: (materialId: string) =>
    [...aulaKeys.all, "actividad-material", materialId] as const,
  actividadTarea: (tareaId: string) => [...aulaKeys.all, "actividad-tarea", tareaId] as const,
};
