import { z } from "zod";
import { TIME_REGEX } from "../consts";
import { timeToMinutes } from "../utils";

export const turnoSchema = z
  .object({
    tipoPersona: z.enum(["estudiantes", "docentes", "administrativos"], {
      message: "Seleccione un tipo de persona válido.",
    }),
    horaEntrada: z.string().regex(TIME_REGEX, "Formato de hora de entrada inválido (HH:mm)"),
    ventanaEntradaInicio: z
      .string()
      .regex(TIME_REGEX, "Formato de inicio de ventana de entrada inválido (HH:mm)"),
    ventanaEntradaFin: z
      .string()
      .regex(TIME_REGEX, "Formato de fin de ventana de entrada inválido (HH:mm)"),
    horaSalida: z.string().regex(TIME_REGEX, "Formato de hora de salida inválido (HH:mm)"),
    ventanaSalidaInicio: z
      .string()
      .regex(TIME_REGEX, "Formato de inicio de ventana de salida inválido (HH:mm)"),
    ventanaSalidaFin: z
      .string()
      .regex(TIME_REGEX, "Formato de fin de ventana de salida inválido (HH:mm)"),
    toleranciaMinutos: z
      .number({ message: "La tolerancia debe ser un número válido." })
      .int("La tolerancia debe ser un número entero.")
      .min(0, "La tolerancia debe estar entre 0 y 60 minutos.")
      .max(60, "La tolerancia debe estar entre 0 y 60 minutos."),
    diasLaborables: z
      .array(z.number().int().min(1).max(7))
      .min(1, "Seleccione al menos un día laborable."),
    activo: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // 1. Validar orden de horas oficiales (salida > entrada)
    if (timeToMinutes(data.horaSalida) <= timeToMinutes(data.horaEntrada)) {
      ctx.addIssue({
        code: "custom",
        path: ["horaSalida"],
        message: "La hora de salida debe ser posterior a la hora de entrada.",
      });
    }

    // 2. Ventana de entrada válida (fin > inicio)
    if (timeToMinutes(data.ventanaEntradaFin) <= timeToMinutes(data.ventanaEntradaInicio)) {
      ctx.addIssue({
        code: "custom",
        path: ["ventanaEntradaFin"],
        message: "El fin de la ventana de entrada debe ser posterior al inicio.",
      });
    }

    // 3. Hora oficial de entrada dentro de su ventana
    if (
      timeToMinutes(data.horaEntrada) < timeToMinutes(data.ventanaEntradaInicio) ||
      timeToMinutes(data.horaEntrada) > timeToMinutes(data.ventanaEntradaFin)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["horaEntrada"],
        message: "La hora oficial debe estar dentro de su ventana de marcado.",
      });
    }

    // 4. Ventana de salida válida (fin > inicio)
    if (timeToMinutes(data.ventanaSalidaFin) <= timeToMinutes(data.ventanaSalidaInicio)) {
      ctx.addIssue({
        code: "custom",
        path: ["ventanaSalidaFin"],
        message: "El fin de la ventana de salida debe ser posterior al inicio.",
      });
    }

    // 5. Hora oficial de salida dentro de su ventana
    if (
      timeToMinutes(data.horaSalida) < timeToMinutes(data.ventanaSalidaInicio) ||
      timeToMinutes(data.horaSalida) > timeToMinutes(data.ventanaSalidaFin)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["horaSalida"],
        message: "La hora oficial debe estar dentro de su ventana de marcado.",
      });
    }

    // 6. Ventana de salida debe empezar después de que termine la ventana de entrada
    if (timeToMinutes(data.ventanaSalidaInicio) < timeToMinutes(data.ventanaEntradaFin)) {
      ctx.addIssue({
        code: "custom",
        path: ["ventanaSalidaInicio"],
        message: "La ventana de salida debe empezar después de la ventana de entrada.",
      });
    }
  });

export type TurnoFormValues = z.infer<typeof turnoSchema>;
