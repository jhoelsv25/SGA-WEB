import type { TipoModeracion } from "../types";

export const LIMITE_ADJUNTO_BYTES = 10 * 1024 * 1024; // 10 MB
export const LIMITE_EDICION_MS = 15 * 60 * 1000; // 15 minutos

export const MENSAJES_VALIDACION = {
  VACIO: "Escriba un texto o agregue un adjunto.",
  ADJUNTO_PESADO: "El adjunto supera el máximo de 10 MB.",
  EDICION_FUERA_DE_PLAZO: "Solo puede editar dentro de los 15 minutos de publicado.",
  MOTIVO_REQUERIDO: "Indique el motivo para ocultar el contenido.",
  ANIO_CERRADO: "El año escolar está cerrado. El muro y el chat son de solo lectura.",
  SIN_ACCESO: "No participa en esta aula virtual.",
} as const;

export const TIPO_MODERACION_CONFIG: Record<
  TipoModeracion,
  { label: string; tone: "brand" | "neutral" | "warning"; singular: string }
> = {
  publicacion: { label: "Publicación", tone: "brand", singular: "la publicación" },
  comentario: { label: "Comentario", tone: "neutral", singular: "el comentario" },
  chat: { label: "Chat", tone: "warning", singular: "el mensaje del chat" },
};
