import { z } from "zod";
import { AREAS_CURRICULARES } from "../consts";
import type { AreaCurricular } from "../types";

export const cursoFormSchema = z.object({
  codigo: z
    .string()
    .min(1, "El código es obligatorio.")
    .max(20, "El código no puede exceder 20 caracteres.")
    .transform((val) => val.trim().toUpperCase()),
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio.")
    .max(100, "El nombre no puede exceder 100 caracteres.")
    .transform((val) => val.trim()),
  areaCurricular: z.enum(AREAS_CURRICULARES as [AreaCurricular, ...AreaCurricular[]], {
    error: "El área curricular seleccionada no es válida.",
  }),
  descripcion: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres.")
    .optional()
    .or(z.literal("")),
  colorHex: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Elija un color válido.")
    .optional()
    .or(z.literal("")),
});

export type CursoFormValues = z.infer<typeof cursoFormSchema>;

export const addCursoPlanSchema = z.object({
  cursoId: z.string().min(1, "Seleccione un curso para el plan de estudios."),
  horasSemanales: z
    .number({
      error: "Las horas semanales deben ser un número.",
    })
    .int("Las horas semanales deben ser un número entero.")
    .min(1, "Las horas semanales deben ser mayores que 0."),
});

export type AddCursoPlanFormValues = z.infer<typeof addCursoPlanSchema>;

export const updateHorasPlanSchema = z.object({
  horasSemanales: z
    .number({
      error: "Las horas semanales deben ser un número.",
    })
    .int("Las horas semanales deben ser un número entero.")
    .min(1, "Las horas semanales deben ser mayores que 0."),
});

export type UpdateHorasPlanFormValues = z.infer<typeof updateHorasPlanSchema>;

export const copyPlanSchema = z.object({
  origenGradoId: z.string().min(1, "Seleccione el grado de origen a copiar."),
});

export type CopyPlanFormValues = z.infer<typeof copyPlanSchema>;

export const updateGradoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del grado es obligatorio.")
    .max(50, "El nombre no puede exceder 50 caracteres.")
    .transform((val) => val.trim()),
});

export type UpdateGradoFormValues = z.infer<typeof updateGradoSchema>;
