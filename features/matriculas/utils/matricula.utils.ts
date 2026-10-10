/**
 * Utilidades de formateo para el módulo de matrículas
 */

export function formatCorrelativoMatricula(codigo: string): string {
  if (!codigo) return "-";
  return codigo.trim();
}

export function formatEstudianteNombreCompleto(apellidos: string, nombres: string): string {
  return `${apellidos.trim()}, ${nombres.trim()}`;
}

export function formatSeccionLabel(gradoNumero: number, seccionNombre: string): string {
  return `${gradoNumero}.° ${seccionNombre}`;
}
