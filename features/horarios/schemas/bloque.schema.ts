import { z } from "zod";

const REGEX_HORA_HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

export const bloqueSchema = z
  .object({
    cursoSeccionId: z.string().nullable().optional(),
    diaSemana: z
      .number()
      .int("El día debe ser un número entero")
      .min(1, "El día mínimo es 1 (lunes)")
      .max(5, "El día máximo es 5 (viernes)"),
    horaInicio: z.string().regex(REGEX_HORA_HH_MM, "Formato de hora inválido (HH:mm)"),
    horaFin: z.string().regex(REGEX_HORA_HH_MM, "Formato de hora inválido (HH:mm)"),
    tipoBloque: z.enum(["clase", "receso"]),
    aula: z.string().max(50, "El aula no puede exceder 50 caracteres").nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.tipoBloque === "clase") {
        return Boolean(data.cursoSeccionId && data.cursoSeccionId.trim().length > 0);
      }
      return true;
    },
    {
      message: "Debes seleccionar un curso para el bloque de clase",
      path: ["cursoSeccionId"],
    },
  )
  .refine(
    (data) => {
      const [hIni, mIni] = data.horaInicio.split(":").map(Number);
      const [hFin, mFin] = data.horaFin.split(":").map(Number);
      const minIni = (hIni ?? 0) * 60 + (mIni ?? 0);
      const minFin = (hFin ?? 0) * 60 + (mFin ?? 0);
      return minFin > minIni;
    },
    {
      message: "La hora de fin debe ser posterior a la hora de inicio",
      path: ["horaFin"],
    },
  );

export type BloqueFormValues = z.infer<typeof bloqueSchema>;

export const copiarHorarioSchema = z.object({
  origenId: z.string().min(1, "Selecciona la sección de origen"),
});

export type CopiarHorarioFormValues = z.infer<typeof copiarHorarioSchema>;

export const proponerGrillaSchema = z.object({
  horaEntrada: z
    .string()
    .regex(REGEX_HORA_HH_MM, "Formato de hora inválido (HH:mm)")
    .optional()
    .or(z.literal("")),
});

export type ProponerGrillaFormValues = z.infer<typeof proponerGrillaSchema>;

export const proponerIaSchema = z.object({
  horaEntrada: z
    .string()
    .regex(REGEX_HORA_HH_MM, "Formato de hora inválido (HH:mm)")
    .optional()
    .or(z.literal("")),
  preferencias: z
    .string()
    .max(500, "Las preferencias no pueden exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type ProponerIaFormValues = z.infer<typeof proponerIaSchema>;
