import { z } from "zod";

export const decisionDirectorSchema = z.object({
  decision: z.enum(["ninguna", "compromiso_mejora", "llamada_atencion", "derivado"]),
  observacion: z.string().max(500, "Máximo 500 caracteres").optional(),
});

export type DecisionDirectorFormValues = z.infer<typeof decisionDirectorSchema>;

export const reabrirConsolidadoSchema = z.object({
  motivoReapertura: z
    .string()
    .min(5, "El motivo de reapertura debe tener al menos 5 caracteres")
    .max(300, "Máximo 300 caracteres"),
});

export type ReabrirConsolidadoFormValues = z.infer<typeof reabrirConsolidadoSchema>;

export const cerrarConsolidadoSchema = z.object({
  motivoCambio: z.string().max(300, "Máximo 300 caracteres").optional(),
});

export type CerrarConsolidadoFormValues = z.infer<typeof cerrarConsolidadoSchema>;

export const solicitarRevisionSchema = z.object({
  motivo: z
    .string()
    .min(10, "El motivo debe tener al menos 10 caracteres")
    .max(500, "Máximo 500 caracteres"),
  adjuntoUrl: z.string().url("Debe ser un enlace válido").optional().or(z.literal("")),
});

export type SolicitarRevisionFormValues = z.infer<typeof solicitarRevisionSchema>;

export const resolverSolicitudSchema = z
  .object({
    accion: z.enum(["aceptar", "rechazar"]),
    respuesta: z.string().max(500, "Máximo 500 caracteres").optional(),
  })
  .refine(
    (data) => {
      if (data.accion === "rechazar") {
        return Boolean(data.respuesta && data.respuesta.trim().length >= 5);
      }
      return true;
    },
    {
      message: "Al rechazar la solicitud debe ingresar una respuesta de al menos 5 caracteres.",
      path: ["respuesta"],
    },
  );

export type ResolverSolicitudFormValues = z.infer<typeof resolverSolicitudSchema>;
