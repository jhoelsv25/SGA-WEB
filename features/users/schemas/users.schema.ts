import { z } from "zod";

export const createUserSchema = z.object({
  personaId: z.string().uuid("Debes seleccionar una persona válida"),
  rolId: z.string().uuid("Debes seleccionar un rol válido"),
  nombreUsuario: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(50, "El nombre de usuario no puede exceder 50 caracteres")
    .regex(/^[a-zA-Z0-9._-]+$/, "Solo se permiten letras, números, puntos y guiones")
    .trim(),
});

export const changeRoleSchema = z.object({
  rolId: z.string().uuid("Debes seleccionar un rol válido"),
});

export const updateUsernameSchema = z.object({
  nombreUsuario: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(50, "El nombre de usuario no puede exceder 50 caracteres")
    .regex(/^[a-zA-Z0-9._-]+$/, "Solo se permiten letras, números, puntos y guiones")
    .trim(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type ChangeRoleFormValues = z.infer<typeof changeRoleSchema>;
export type UpdateUsernameFormValues = z.infer<typeof updateUsernameSchema>;
