import type { Persona } from "../types/personas.types";

export type TipoFichaAcademica = "docente" | "estudiante";

/** Vigente = docente activo/licencia o estudiante activo. Lo demás es una ficha dada de baja. */
export function esFichaVigente(tipo: TipoFichaAcademica, estado: string): boolean {
  return tipo === "docente" ? estado === "activo" || estado === "licencia" : estado === "activo";
}

/** Estado de la ficha de ese tipo; si el padrón aún no lo informa se asume 'activo'. */
export function estadoFicha(persona: Persona, tipo: TipoFichaAcademica): string | null {
  const f = persona.fichas;
  if (tipo === "docente") return f.estadoDocente ?? (f.esDocente ? "activo" : null);
  return f.estadoEstudiante ?? (f.esEstudiante ? "activo" : null);
}

/** Etiqueta de estado de baja para mostrar junto a la ficha ("baja", "retirado", …). */
export function etiquetaBaja(tipo: TipoFichaAcademica, estado: string): string {
  if (tipo === "docente") return "cesado";
  return estado;
}

/** Ficha académica vigente de la persona que habría que dar de baja para registrarla en `destino`. */
export function fichaVigenteAlRegistrar(
  persona: Persona,
  destino: TipoFichaAcademica,
): { tipo: TipoFichaAcademica; estado: string } | null {
  const otra: TipoFichaAcademica = destino === "docente" ? "estudiante" : "docente";
  const estado = estadoFicha(persona, otra);
  return estado && esFichaVigente(otra, estado) ? { tipo: otra, estado } : null;
}
