import { z } from "zod";

const vacantesNumberSchema = z
  .number({
    error: "Las vacantes deben ser mayores que 0.",
  })
  .int("Las vacantes deben ser un número entero.")
  .min(1, "Las vacantes deben ser mayores que 0.");

export const seccionFormSchema = z.object({
  gradoId: z
    .string()
    .min(1, "El grado es obligatorio.")
    .uuid("El grado es obligatorio.")
    .optional(),
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(10, "El nombre no puede exceder 10 caracteres."),
  aula: z
    .string()
    .trim()
    .max(50, "El aula no puede exceder 50 caracteres.")
    .optional()
    .or(z.literal("")),
  vacantes: vacantesNumberSchema,
  tutorId: z.string().uuid("El tutor debe ser un UUID válido.").optional().or(z.literal("")),
});

export type SeccionFormValues = z.infer<typeof seccionFormSchema>;

export const createSeccionSchema = seccionFormSchema.extend({
  gradoId: z.string().min(1, "El grado es obligatorio.").uuid("El grado es obligatorio."),
});

export type CreateSeccionFormValues = z.infer<typeof createSeccionSchema>;

export const updateSeccionSchema = seccionFormSchema;

export type UpdateSeccionFormValues = z.infer<typeof updateSeccionSchema>;
