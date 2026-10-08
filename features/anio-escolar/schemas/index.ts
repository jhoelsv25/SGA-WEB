import { z } from "zod";

const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const FECHA_INVALIDA = "Indique una fecha válida (AAAA-MM-DD).";
const FECHAS_INVERTIDAS = "La fecha de fin debe ser posterior a la fecha de inicio.";
const BIMESTRE_FUERA = "Las fechas del bimestre deben estar dentro del año escolar.";
const BIMESTRES_SUPERPUESTOS = "El bimestre no puede empezar antes de que termine el anterior.";
const REAPERTURA_INCOMPLETA = "Indique el motivo y la fecha límite de la reapertura.";

const bimestreFechaSchema = z.object({
  numero: z.number().int().min(1).max(4),
  fechaInicio: z.string().regex(FECHA, FECHA_INVALIDA),
  fechaFin: z.string().regex(FECHA, FECHA_INVALIDA),
});

export const anioSchema = z
  .object({
    anio: z.number({ message: "Indique el número del año escolar." }).int().min(2000).max(2100),
    nombre: z.string().max(150).optional(),
    fechaInicio: z.string().regex(FECHA, FECHA_INVALIDA),
    fechaFin: z.string().regex(FECHA, FECHA_INVALIDA),
    bimestres: z.array(bimestreFechaSchema).length(4, "Complete las fechas de los 4 bimestres."),
  })
  .superRefine((data, ctx) => {
    if (data.fechaFin <= data.fechaInicio) {
      ctx.addIssue({ code: "custom", path: ["fechaFin"], message: FECHAS_INVERTIDAS });
    }
    validarBimestres(data, ctx, ["bimestres"]);
  });

export const fechasAnioSchema = z
  .object({
    nombre: z.string().max(150).optional(),
    fechaInicio: z.string().regex(FECHA, FECHA_INVALIDA),
    fechaFin: z.string().regex(FECHA, FECHA_INVALIDA),
  })
  .superRefine((data, ctx) => {
    if (data.fechaFin <= data.fechaInicio) {
      ctx.addIssue({ code: "custom", path: ["fechaFin"], message: FECHAS_INVERTIDAS });
    }
  });

export const bimestresSchema = z
  .object({
    fechaInicio: z.string().regex(FECHA, FECHA_INVALIDA),
    fechaFin: z.string().regex(FECHA, FECHA_INVALIDA),
    bimestres: z.array(bimestreFechaSchema).length(4, "Complete las fechas de los 4 bimestres."),
  })
  .superRefine((data, ctx) => {
    validarBimestres(data, ctx, ["bimestres"]);
  });

export const reabrirSchema = z.object({
  motivo: z.string().trim().min(1, REAPERTURA_INCOMPLETA).max(500, REAPERTURA_INCOMPLETA),
  fechaLimite: z.string().regex(FECHA, REAPERTURA_INCOMPLETA),
});

export const eventoSchema = z
  .object({
    titulo: z.string().trim().min(1, "Indique el título del evento.").max(150),
    descripcion: z.string().max(500).optional(),
    tipo: z.enum(["feriado", "suspension", "jornada_pedagogica", "reunion", "actividad", "examen"]),
    fechaInicio: z.string().regex(FECHA, FECHA_INVALIDA),
    fechaFin: z.string().regex(FECHA, FECHA_INVALIDA),
    suspendeClases: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.fechaFin < data.fechaInicio) {
      ctx.addIssue({ code: "custom", path: ["fechaFin"], message: FECHAS_INVERTIDAS });
    }
  });

export type AnioFormValues = z.infer<typeof anioSchema>;
export type FechasAnioFormValues = z.infer<typeof fechasAnioSchema>;
export type BimestresFormValues = z.infer<typeof bimestresSchema>;
export type ReabrirFormValues = z.infer<typeof reabrirSchema>;
export type EventoFormValues = z.infer<typeof eventoSchema>;

function validarBimestres(
  data: {
    fechaInicio: string;
    fechaFin: string;
    bimestres: { numero: number; fechaInicio: string; fechaFin: string }[];
  },
  ctx: z.RefinementCtx,
  path: (string | number)[],
): void {
  const ordenados = [...data.bimestres].sort((a, b) => a.numero - b.numero);
  for (const [indice, bimestre] of ordenados.entries()) {
    if (bimestre.fechaFin <= bimestre.fechaInicio) {
      ctx.addIssue({
        code: "custom",
        path: [...path, indice, "fechaFin"],
        message: FECHAS_INVERTIDAS,
      });
    }
    if (bimestre.fechaInicio < data.fechaInicio || bimestre.fechaFin > data.fechaFin) {
      ctx.addIssue({
        code: "custom",
        path: [...path, indice, "fechaFin"],
        message: BIMESTRE_FUERA,
      });
    }
    const anterior = ordenados[indice - 1];
    if (anterior && bimestre.fechaInicio <= anterior.fechaFin) {
      ctx.addIssue({
        code: "custom",
        path: [...path, indice, "fechaInicio"],
        message: BIMESTRES_SUPERPUESTOS,
      });
    }
  }
}
