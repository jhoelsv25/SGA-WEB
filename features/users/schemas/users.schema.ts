import { z } from "zod";

const nombreUsuarioSchema = z
  .string()
  .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
  .max(50, "El nombre de usuario no puede exceder 50 caracteres")
  .regex(/^[a-zA-Z0-9._-]+$/, "Solo se permiten letras, números, puntos y guiones")
  .trim()
  .optional()
  .or(z.literal(""));

/** RF-002 V3: registro único. Persona existente (personaId) o nueva (persona), no ambas. */
export const createUserSchema = z
  .object({
    tipoPersona: z.enum(["existente", "nueva"]),
    personaId: z.string().uuid("Debes seleccionar una persona válida").optional().or(z.literal("")),
    numeroDocumento: z.string().trim().optional().or(z.literal("")),
    tipoDocumento: z
      .enum(["dni", "carne_extranjeria", "pasaporte", "partida_nacimiento"])
      .optional(),
    nombres: z.string().trim().optional().or(z.literal("")),
    apellidoPaterno: z.string().trim().optional().or(z.literal("")),
    apellidoMaterno: z.string().trim().optional().or(z.literal("")),
    sexo: z.enum(["M", "F"]).optional(),
    correo: z.string().trim().optional().or(z.literal("")),
    celular: z.string().trim().optional().or(z.literal("")),
    cargoId: z.string().uuid("Debes seleccionar un cargo válido"),
    rolIds: z.array(z.string().uuid()).min(1, "Selecciona al menos un rol").optional(),
    nombreUsuario: nombreUsuarioSchema,
  })
  .superRefine((data, ctx) => {
    if (data.tipoPersona === "existente" && !data.personaId) {
      ctx.addIssue({
        code: "custom",
        path: ["personaId"],
        message: "Selecciona una persona del padrón",
      });
    }
    if (data.tipoPersona === "nueva") {
      if (!data.tipoDocumento) {
        ctx.addIssue({ code: "custom", path: ["tipoDocumento"], message: "Requerido" });
      }
      if (!data.numeroDocumento) {
        ctx.addIssue({ code: "custom", path: ["numeroDocumento"], message: "Requerido" });
      }
      if (!data.nombres) {
        ctx.addIssue({ code: "custom", path: ["nombres"], message: "Requerido" });
      }
      if (!data.apellidoPaterno) {
        ctx.addIssue({ code: "custom", path: ["apellidoPaterno"], message: "Requerido" });
      }
      if (!data.sexo) {
        ctx.addIssue({ code: "custom", path: ["sexo"], message: "Requerido" });
      }
    }
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
