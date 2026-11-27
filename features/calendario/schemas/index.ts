import { z } from "zod";

const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const FECHA_INVALIDA = "Indique una fecha válida (AAAA-MM-DD).";
const FECHAS_INVERTIDAS = "La fecha de fin debe ser posterior a la fecha de inicio.";

export const eventoSchema = z
  .object({
    titulo: z.string().trim().min(1, "Indique el título del evento.").max(150),
    descripcion: z.string().max(500).optional(),
    tipo: z.enum(["feriado", "suspension", "jornada_pedagogica", "reunion", "actividad", "examen"]),
    fechaInicio: z.string().regex(FECHA, FECHA_INVALIDA),
    fechaFin: z.string().regex(FECHA, FECHA_INVALIDA),
    suspendeClases: z.boolean(),
    personalLabora: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.fechaFin < data.fechaInicio) {
      ctx.addIssue({ code: "custom", path: ["fechaFin"], message: FECHAS_INVERTIDAS });
    }
  });

export type EventoFormValues = z.infer<typeof eventoSchema>;
