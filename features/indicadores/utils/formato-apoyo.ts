import type { ResumenApoyoDto } from "../types";

/** Valor corto de un indicador de apoyo para tablas y tarjetas; `null` si no hay datos. */
export function valorCortoApoyo(resumen: ResumenApoyoDto, clave: string): string | null {
  switch (clave) {
    case "jornadasEfectivas": {
      const r = resumen.jornadasEfectivas;
      return r.sinDatos || r.valor === null ? null : `${r.valor.toFixed(2)} %`;
    }
    case "minutosPerdidos": {
      const r = resumen.minutosPerdidos;
      return r.sinDatos || r.total === null ? null : `${r.total} min`;
    }
    case "promedioMinutosPerdidos": {
      const r = resumen.minutosPerdidos;
      return r.sinDatos || r.promedioPorSesion === null
        ? null
        : `${r.promedioPorSesion.toFixed(2)} min`;
    }
    case "puntualidad": {
      const r = resumen.puntualidad;
      return r.sinDatos || r.valor === null ? null : `${r.valor.toFixed(2)} %`;
    }
    case "minutosFueraAula": {
      const r = resumen.minutosFueraAula;
      return r.sinDatos || r.minutos === null ? null : `${r.minutos} min`;
    }
    case "tiempoResolucion": {
      const r = resumen.tiempoResolucion;
      return r.sinDatos || r.promedioDias === null ? null : `${r.promedioDias.toFixed(1)} días`;
    }
    default:
      return null;
  }
}
