import { z } from "zod";
import { MENSAJES_CONSOLIDADO } from "../../consts";

/**
 * Esquema de validación para la solicitud de revisión del consolidado por parte del docente (HU3).
 * El motivo es obligatorio según CP-RF013-13.
 */
export const solicitudRevisionSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(1, MENSAJES_CONSOLIDADO.SOLICITUD_SIN_MOTIVO)
    .max(1000, "El motivo de la solicitud no puede superar los 1000 caracteres."),
});

export type SolicitudRevisionFormValues = z.infer<typeof solicitudRevisionSchema>;
