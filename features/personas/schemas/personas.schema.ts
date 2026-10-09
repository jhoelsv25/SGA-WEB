import { z } from "zod";

export const personaBaseSchema = z.object({
  tipoDocumento: z.enum(["dni", "carne_extranjeria", "pasaporte", "partida_nacimiento"], {
    message: "Seleccione un tipo de documento válido.",
  }),
  numeroDocumento: z
    .string()
    .min(3, "El número de documento es obligatorio.")
    .max(20, "Máximo 20 caracteres.")
    .trim(),
  nombres: z
    .string()
    .min(2, "Los nombres son obligatorios.")
    .max(100, "Máximo 100 caracteres.")
    .trim(),
  apellidoPaterno: z
    .string()
    .min(2, "El apellido paterno es obligatorio.")
    .max(60, "Máximo 60 caracteres.")
    .trim(),
  apellidoMaterno: z.string().max(60, "Máximo 60 caracteres.").trim().optional().or(z.literal("")),
  sexo: z.enum(["M", "F"], {
    message: "Seleccione el sexo (M o F).",
  }),
  fechaNacimiento: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val) return true;
        const fecha = new Date(val);
        const hoy = new Date();
        return fecha <= hoy;
      },
      { message: "La fecha de nacimiento no puede ser futura." },
    ),
  direccion: z.string().max(255).optional().or(z.literal("")),
  distrito: z.string().max(100).optional().or(z.literal("")),
  telefono: z.string().max(20).optional().or(z.literal("")),
  celular: z.string().max(20).optional().or(z.literal("")),
  correo: z.string().email("Ingrese un correo electrónico válido.").optional().or(z.literal("")),
  fotoUrl: z.string().url("Ingrese una URL válida.").optional().or(z.literal("")),
});

export const createPersonaSchema = personaBaseSchema.superRefine((data, ctx) => {
  if (data.tipoDocumento === "dni") {
    if (!/^\d{8}$/.test(data.numeroDocumento)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El DNI debe tener exactamente 8 dígitos numéricos.",
        path: ["numeroDocumento"],
      });
    }
  }
});

export type CreatePersonaFormValues = z.infer<typeof createPersonaSchema>;

export const updatePersonaSchema = personaBaseSchema.partial().extend({
  motivo: z.string().optional(),
});

export type UpdatePersonaFormValues = z.infer<typeof updatePersonaSchema>;
