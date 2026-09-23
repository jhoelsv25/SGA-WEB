import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(3, "El usuario o DNI debe tener al menos 3 caracteres"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
  rememberUser: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
