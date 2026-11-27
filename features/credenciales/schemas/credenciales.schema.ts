import { z } from "zod";

export const reemitirCredencialSchema = z.object({
  motivo: z
    .string()
    .min(3, "Indique el motivo de la anulación y reemisión.")
    .max(255, "Máximo 255 caracteres"),
});

export type ReemitirCredencialFormValues = z.infer<typeof reemitirCredencialSchema>;

export const cambiarPinSchema = z
  .object({
    nuevoPin: z
      .string()
      .regex(/^[0-9]{4}$/, "El nuevo PIN debe tener exactamente 4 dígitos numéricos"),
    confirmarPin: z.string(),
  })
  .refine((data) => data.nuevoPin === data.confirmarPin, {
    message: "Los PINs no coinciden",
    path: ["confirmarPin"],
  });

export type CambiarPinFormValues = z.infer<typeof cambiarPinSchema>;
