import { z } from "zod";

export const programarLibretasSchema = z.object({
  periodoId: z.string().min(1, "Elige el bimestre.").uuid("Elige el bimestre."),
  fechaLimite: z
    .string()
    .min(1, "Elige la fecha límite.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Elige la fecha límite."),
});

export type ProgramarLibretasFormValues = z.infer<typeof programarLibretasSchema>;
