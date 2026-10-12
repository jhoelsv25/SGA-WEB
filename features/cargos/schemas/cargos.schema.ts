import { z } from "zod";

export const createCargoSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre del cargo debe tener al menos 2 caracteres")
    .max(80, "El nombre no puede exceder 80 caracteres")
    .trim(),
  descripcion: z
    .string()
    .max(255, "La descripción no puede exceder 255 caracteres")
    .trim()
    .optional()
    .or(z.literal("")),
  rolesSugeridosIds: z.array(z.string().uuid()).optional(),
});

export type CreateCargoFormValues = z.infer<typeof createCargoSchema>;
