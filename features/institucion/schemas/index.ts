import { z } from "zod";

export const updateInstitucionSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre de la institución debe tener al menos 3 caracteres.")
    .max(200, "El nombre no puede exceder 200 caracteres."),
  codigoModular: z
    .string()
    .trim()
    .min(6, "El código modular debe tener al menos 6 caracteres.")
    .max(20, "El código modular no puede exceder 20 caracteres."),
  codigoLocal: z
    .string()
    .trim()
    .max(20, "El código de local no puede exceder 20 caracteres.")
    .optional()
    .or(z.literal("")),
  tipoGestion: z.enum(["publica", "privada", "convenio"], {
    message: "Seleccione un tipo de gestión válido.",
  }),
  ugelDre: z
    .string()
    .trim()
    .max(100, "La UGEL / DRE no puede exceder 100 caracteres.")
    .optional()
    .or(z.literal("")),
  director: z
    .string()
    .trim()
    .max(150, "El nombre del director no puede exceder 150 caracteres.")
    .optional()
    .or(z.literal("")),
  direccion: z
    .string()
    .trim()
    .min(3, "La dirección debe tener al menos 3 caracteres.")
    .max(255, "La dirección no puede exceder 255 caracteres."),
  departamento: z
    .string()
    .trim()
    .max(100, "El departamento no puede exceder 100 caracteres.")
    .optional()
    .or(z.literal("")),
  provincia: z
    .string()
    .trim()
    .max(100, "La provincia no puede exceder 100 caracteres.")
    .optional()
    .or(z.literal("")),
  distrito: z
    .string()
    .trim()
    .max(100, "El distrito no puede exceder 100 caracteres.")
    .optional()
    .or(z.literal("")),
  telefono: z
    .string()
    .trim()
    .max(20, "El teléfono no puede exceder 20 caracteres.")
    .optional()
    .or(z.literal("")),
  correo: z.string().trim().email("Ingrese un correo válido.").optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
});

export type UpdateInstitucionFormValues = z.infer<typeof updateInstitucionSchema>;
