import { z } from "zod";
import { personaBaseSchema } from "../../personas/schemas/personas.schema";

export const createEstudianteSchema = z
  .object({
    // Modalidad de vinculación con padrón
    personaId: z.string().uuid().optional().or(z.literal("")),
    nuevaPersona: personaBaseSchema.optional(),

    // Datos escolares y médicos
    codigo: z
      .string()
      .min(1, "El código SIAGIE es obligatorio.")
      .max(20, "Máximo 20 caracteres.")
      .trim(),
    fechaIngreso: z
      .string()
      .min(1, "La fecha de ingreso es obligatoria.")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)"),
    lenguaMaterna: z.string().max(50, "Máximo 50 caracteres.").optional().or(z.literal("")),
    religion: z.string().max(50, "Máximo 50 caracteres.").optional().or(z.literal("")),
    tieneDiscapacidad: z.boolean(),
    detalleDiscapacidad: z.string().max(255, "Máximo 255 caracteres.").optional().or(z.literal("")),
    grupoSanguineo: z.string().max(5, "Máximo 5 caracteres.").optional().or(z.literal("")),
    alergias: z.string().max(255, "Máximo 255 caracteres.").optional().or(z.literal("")),
    condicionesMedicas: z.string().max(500, "Máximo 500 caracteres.").optional().or(z.literal("")),
    seguroSalud: z.string().max(100, "Máximo 100 caracteres.").optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (
      !data.tieneDiscapacidad &&
      data.detalleDiscapacidad &&
      data.detalleDiscapacidad.trim() !== ""
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Indique el detalle solo si el estudiante tiene discapacidad.",
        path: ["detalleDiscapacidad"],
      });
    }
  });

export type CreateEstudianteFormValues = z.infer<typeof createEstudianteSchema>;

export const updateEstudianteSchema = z
  .object({
    fechaIngreso: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)")
      .optional()
      .or(z.literal("")),
    lenguaMaterna: z.string().max(50).optional().or(z.literal("")),
    religion: z.string().max(50).optional().or(z.literal("")),
    tieneDiscapacidad: z.boolean(),
    detalleDiscapacidad: z.string().max(255).optional().or(z.literal("")),
    grupoSanguineo: z.string().max(5).optional().or(z.literal("")),
    alergias: z.string().max(255).optional().or(z.literal("")),
    condicionesMedicas: z.string().max(500).optional().or(z.literal("")),
    seguroSalud: z.string().max(100).optional().or(z.literal("")),
    estado: z.enum(["activo", "retirado", "trasladado", "egresado"], {
      message: "Seleccione un estado escolar válido.",
    }),
    motivo: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      !data.tieneDiscapacidad &&
      data.detalleDiscapacidad &&
      data.detalleDiscapacidad.trim() !== ""
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Indique el detalle solo si el estudiante tiene discapacidad.",
        path: ["detalleDiscapacidad"],
      });
    }
  });

export type UpdateEstudianteFormValues = z.infer<typeof updateEstudianteSchema>;
