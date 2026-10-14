import { z } from "zod";
import { MENSAJES_AUSENCIA } from "@/features/ausencias-docente/consts";

/**
 * Esquema Zod de validación para la anulación de una ausencia docente (CP-RF012-17).
 */
export const anularAusenciaSchema = z.object({
  motivoAnulacion: z
    .string()
    .trim()
    .min(1, { message: MENSAJES_AUSENCIA.ANULACION_SIN_MOTIVO })
    .max(500, { message: "El motivo de la anulación no puede superar los 500 caracteres." }),
});

export type AnularAusenciaFormValues = z.infer<typeof anularAusenciaSchema>;
