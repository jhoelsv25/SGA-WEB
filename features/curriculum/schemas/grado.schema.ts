import { z } from "zod";

export const updateGradoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del grado es obligatorio.")
    .max(50, "El nombre no puede exceder 50 caracteres.")
    .transform((val) => val.trim()),
});

export type UpdateGradoFormValues = z.infer<typeof updateGradoSchema>;
