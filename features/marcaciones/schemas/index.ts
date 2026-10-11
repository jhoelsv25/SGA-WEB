import { z } from "zod";
import { MENSAJE_MOTIVO_MANUAL } from "../consts";

export const marcacionManualSchema = z.object({
  personaId: z.string().min(1, "Seleccione la persona."),
  tipo: z.enum(["entrada", "salida"]),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Seleccione la fecha."),
  hora: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Indique la hora real (HH:mm)."),
  observacion: z.string().trim().min(1, MENSAJE_MOTIVO_MANUAL).max(500),
});

export type MarcacionManualFormValues = z.infer<typeof marcacionManualSchema>;
