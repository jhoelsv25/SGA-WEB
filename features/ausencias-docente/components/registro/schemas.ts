import { z } from "zod";
import { MOTIVOS_AUSENCIA } from "../../consts";
import { validarHorasAusencia, validarObservacionMotivo } from "../../utils";

/**
 * Esquema Zod de validación para el formulario de registro de ausencia docente (RF-012 HU1).
 * Aplica validaciones locales estrictas con los mensajes exactos del requerimiento.
 */
export const esquemaRegistroAusencia = z
  .object({
    horaDesde: z
      .string()
      .min(1, "Indique la hora inicial.")
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Formato de hora inválido (HH:mm)."),
    horaHasta: z
      .string()
      .min(1, "Indique la hora final.")
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Formato de hora inválido (HH:mm)."),
    motivo: z.enum(MOTIVOS_AUSENCIA, {
      message: "Seleccione un motivo válido.",
    }),
    observacion: z.string().max(1000, "Máximo 1000 caracteres.").optional(),
  })
  .superRefine((data, ctx) => {
    // CP-RF012-05: Horas invertidas o iguales
    const errorHoras = validarHorasAusencia(data.horaDesde, data.horaHasta);
    if (errorHoras) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorHoras,
        path: ["horaHasta"],
      });
    }

    // CP-RF012-06: Observación obligatoria cuando el motivo es «otro»
    const errorObservacion = validarObservacionMotivo(data.motivo, data.observacion);
    if (errorObservacion) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorObservacion,
        path: ["observacion"],
      });
    }
  });

export type EsquemaRegistroAusenciaValores = z.infer<typeof esquemaRegistroAusencia>;
