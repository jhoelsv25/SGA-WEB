import { z } from "zod";

export const equipoSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(3, "El nombre del equipo debe tener al menos 3 caracteres.")
      .max(100, "El nombre no puede exceder 100 caracteres."),
    ubicacion: z
      .string()
      .trim()
      .min(3, "La ubicación debe tener al menos 3 caracteres.")
      .max(150, "La ubicación no puede exceder 150 caracteres."),
    tipo: z.enum(["kiosko", "biometrico"], {
      message: "Seleccione un tipo de equipo válido.",
    }),
    proposito: z.enum(["marcacion", "sesiones"], {
      message: "Seleccione un propósito válido.",
    }),
    usuariosPermitidos: z
      .array(z.enum(["estudiantes", "docentes", "administrativos"]))
      .min(1, "Indique quién puede usar este equipo."),
    numeroSerie: z
      .string()
      .trim()
      .max(100, "El número de serie no puede exceder 100 caracteres.")
      .optional()
      .or(z.literal("")),
    activo: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // Si el propósito es "sesiones", debe ser obligatoriamente tipo "kiosko" y exclusivo para "docentes"
    if (data.proposito === "sesiones") {
      if (data.tipo !== "kiosko") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["tipo"],
          message: "Un equipo de sesiones debe ser un kiosko de uso exclusivo de docentes.",
        });
      }

      const esExclusivoDocentes =
        data.usuariosPermitidos.length === 1 && data.usuariosPermitidos[0] === "docentes";

      if (!esExclusivoDocentes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["usuariosPermitidos"],
          message: "Un equipo de sesiones debe ser un kiosko de uso exclusivo de docentes.",
        });
      }
    }
  });

export type EquipoFormValues = z.infer<typeof equipoSchema>;
