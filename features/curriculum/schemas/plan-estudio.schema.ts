import { z } from "zod";

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
