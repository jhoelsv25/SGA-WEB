export const HEADER_ANIO_ACADEMICO = "x-anio-academico-id";

let anioActivo: string | null = null;

export function idAnioLectivoActivo(): string | null {
  return anioActivo;
}

export function fijarAnioLectivoActivo(id: string | null) {
  anioActivo = id;
}
