import { z } from "zod";
import { personaBaseSchema } from "../../personas/schemas/personas.schema";

export const cesarDocenteSchema = z.object({
  fechaCese: z
    .string()
    .min(1, "La fecha de cese es obligatoria.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  motivo: z.string().max(255, "Máximo 255 caracteres.").optional().or(z.literal("")),
});

export type CesarDocenteFormValues = z.infer<typeof cesarDocenteSchema>;

export const editDocenteSchema = z.object({
  especialidad: z.string().max(100, "Máximo 100 caracteres.").optional().or(z.literal("")),
  tituloProfesional: z.string().max(150, "Máximo 150 caracteres.").optional().or(z.literal("")),
  tipoContrato: z.enum(["nombrado", "contratado", "destacado", "encargado", "practicante"], {
    message: "Seleccione un régimen de contrato válido.",
  }),
  jornadaHoras: z.union([z.literal(20), z.literal(24), z.literal(30), z.literal(40)]),
  estado: z.enum(["activo", "licencia", "cesado"], {
    message: "Seleccione un estado válido.",
  }),
});

export type EditDocenteFormValues = z.infer<typeof editDocenteSchema>;

export const createDocenteSchema = z.object({
  // Modalidad: persona existente o nueva
  personaId: z.string().uuid().optional().or(z.literal("")),
  nuevaPersona: personaBaseSchema.optional(),

  // Datos laborales de la ficha
  codigo: z.string().max(20, "Máximo 20 caracteres.").trim().optional().or(z.literal("")),
  especialidad: z.string().max(100).optional().or(z.literal("")),
  tituloProfesional: z.string().max(150).optional().or(z.literal("")),
  tipoContrato: z.enum(["nombrado", "contratado", "destacado", "encargado", "practicante"], {
    message: "Seleccione un régimen de contrato válido.",
  }),
  jornadaHoras: z.union([z.literal(20), z.literal(24), z.literal(30), z.literal(40)]),
  fechaIngreso: z
    .string()
    .min(1, "La fecha de ingreso es obligatoria.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  cargoId: z.string().uuid().optional().or(z.literal("")),
});

export type CreateDocenteFormValues = z.infer<typeof createDocenteSchema>;
