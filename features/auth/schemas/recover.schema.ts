import { z } from "zod";

export const recoverSchema = z.object({
  username: z.string().trim().min(3, "Ingresa un código o usuario institucional válido"),
  birthdate: z.date({
    message: "Selecciona tu fecha de nacimiento",
  }),
});

export type RecoverFormValues = z.infer<typeof recoverSchema>;
