import { z } from "zod";

export const createRoleSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre del rol debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .trim(),
  descripcion: z
    .string()
    .max(255, "La descripción no puede exceder 255 caracteres")
    .trim()
    .optional()
    .or(z.literal("")),
});

export const updateRoleSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre del rol debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .trim()
    .optional(),
  descripcion: z
    .string()
    .max(255, "La descripción no puede exceder 255 caracteres")
    .trim()
    .optional()
    .or(z.literal("")),
  activo: z.boolean().optional(),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;
export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;
