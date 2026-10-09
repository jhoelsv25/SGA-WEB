import { z } from "zod";
import type { VariableSistema } from "../types";

export function createEditVariableSchema(variable: VariableSistema) {
  return z
    .object({
      valor: z.string().trim().min(1, "El valor es obligatorio."),
      motivoCambio: z.string().trim().min(1, "El motivo del cambio es obligatorio."),
    })
    .superRefine((data, ctx) => {
      if (variable.tipo === "entero" || variable.tipo === "decimal") {
        const num = Number(data.valor);
        if (Number.isNaN(num)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              variable.tipo === "entero"
                ? "El valor debe ser un número entero."
                : "El valor debe ser un número válido.",
            path: ["valor"],
          });
          return;
        }

        if (variable.tipo === "entero" && !Number.isInteger(num)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "El valor debe ser un número entero sin decimales.",
            path: ["valor"],
          });
          return;
        }

        if (variable.valorMinimo !== null && num < variable.valorMinimo) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `El valor no puede ser menor a ${variable.valorMinimo}.`,
            path: ["valor"],
          });
        }

        if (variable.valorMaximo !== null && num > variable.valorMaximo) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `El valor no puede ser mayor a ${variable.valorMaximo}.`,
            path: ["valor"],
          });
        }
      }
    });
}

export type EditVariableFormValues = z.infer<ReturnType<typeof createEditVariableSchema>>;
