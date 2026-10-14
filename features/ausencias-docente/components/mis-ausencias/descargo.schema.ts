import { z } from "zod";
import { MENSAJES_AUSENCIA } from "../../consts";

/**
 * Esquema de validación para el formulario de descargo del docente.
 * El texto del descargo es obligatorio y tiene un límite de 1000 caracteres.
 */
export const descargoSchema = z.object({
  descargo: z
    .string()
    .trim()
    .min(1, MENSAJES_AUSENCIA.DESCARGO_OBLIGATORIO)
    .max(1000, "El texto del descargo no puede superar los 1000 caracteres."),
});

export type DescargoFormValues = z.infer<typeof descargoSchema>;
