import type { UsuarioPermitido } from "../types";

export function parseUsuariosPermitidos(value: unknown): UsuarioPermitido[] {
  if (Array.isArray(value)) {
    return value as UsuarioPermitido[];
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean) as UsuarioPermitido[];
  }
  return [];
}
