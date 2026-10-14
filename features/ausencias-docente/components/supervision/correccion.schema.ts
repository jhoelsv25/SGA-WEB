import { z } from "zod";
import {
  MENSAJES_AUSENCIA,
  MOTIVOS_AUSENCIA,
  type MotivoAusencia,
} from "@/features/ausencias-docente/consts";

export interface HorarioSesionRef {
  horaInicio: string;
  horaFin: string;
}

/**
 * Genera el esquema Zod de corrección contextualizado con el horario de la sesión.
 * Aplica validaciones y mensajes oficiales exactos (CP-RF012-04, 05, 06, 11).
 */
export function crearCorregirAusenciaSchema(horarioSesion?: HorarioSesionRef) {
  return z
    .object({
      horaDesde: z.string().min(1, { message: "Indique la hora de inicio." }),
      horaHasta: z.string().min(1, { message: "Indique la hora de fin." }),
      motivo: z.enum(MOTIVOS_AUSENCIA, {
        message: "Seleccione un motivo válido.",
      }),
      observacion: z.string().optional().default(""),
      motivoCambio: z
        .string()
        .trim()
        .min(1, { message: MENSAJES_AUSENCIA.CORRECCION_SIN_MOTIVO })
        .max(500, { message: "El motivo del cambio no puede superar los 500 caracteres." }),
    })
    .superRefine((valores, contexto) => {
      // CP-RF012-05: Horas invertidas o iguales
      if (valores.horaDesde && valores.horaHasta && valores.horaHasta <= valores.horaDesde) {
        contexto.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["horaHasta"],
          message: MENSAJES_AUSENCIA.HORAS_INVERTIDAS,
        });
      }

      // CP-RF012-04: Tramo fuera del horario de la sesión
      if (horarioSesion && valores.horaDesde && valores.horaHasta) {
        if (
          valores.horaDesde < horarioSesion.horaInicio ||
          valores.horaHasta > horarioSesion.horaFin
        ) {
          contexto.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["horaDesde"],
            message: MENSAJES_AUSENCIA.FUERA_HORARIO_SESION(
              `${horarioSesion.horaInicio} a ${horarioSesion.horaFin}`,
            ),
          });
        }
      }

      // CP-RF012-06: Motivo «otro» sin observación descriptiva
      if (
        valores.motivo === "otro" &&
        (!valores.observacion || valores.observacion.trim().length === 0)
      ) {
        contexto.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["observacion"],
          message: MENSAJES_AUSENCIA.FALTA_OBSERVACION,
        });
      }
    });
}

export interface CorregirAusenciaFormValues {
  horaDesde: string;
  horaHasta: string;
  motivo: MotivoAusencia;
  observacion?: string;
  motivoCambio: string;
}
