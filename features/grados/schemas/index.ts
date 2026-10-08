import { z } from "zod";

export const updateGradoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del grado no puede estar vacío.")
    .max(50, "El nombre no puede exceder los 50 caracteres.")
    .trim(),
});

export type UpdateGradoFormValues = z.infer<typeof updateGradoSchema>;
