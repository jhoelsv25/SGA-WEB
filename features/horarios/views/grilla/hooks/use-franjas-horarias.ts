import { useMemo } from "react";
import type { BloqueHorario, BloquePropuesta } from "../../../types";
import { convertirHoraAMinutos, minutosAHora } from "../../../utils";

export interface FranjaHoraria {
  inicio: string;
  fin: string;
  minInicio: number;
  minFin: number;
}

export interface UseFranjasHorariasResult {
  franjas: FranjaHoraria[];
  duracionBaseClase?: number;
  tieneContenido: boolean;
}

/**
 * Hook para extraer las franjas horarias estrictamente a partir de los bloques
 * registrados de la sección y/o de la grilla propuesta por la API (cero datos fijos).
 */
export function useFranjasHorarias(
  bloques: BloqueHorario[],
  bloquesPropuestos: BloquePropuesta[],
): UseFranjasHorariasResult {
  return useMemo(() => {
    const puntos = new Set<string>();
    const duracionesClase: number[] = [];

    for (const b of bloques) {
      puntos.add(b.horaInicio);
      puntos.add(b.horaFin);
      if (b.tipoBloque === "clase") {
        const d = convertirHoraAMinutos(b.horaFin) - convertirHoraAMinutos(b.horaInicio);
        if (d > 0) duracionesClase.push(d);
      }
    }

    for (const p of bloquesPropuestos) {
      puntos.add(p.horaInicio);
      puntos.add(p.horaFin);
      if (p.tipoBloque === "clase") {
        const d = convertirHoraAMinutos(p.horaFin) - convertirHoraAMinutos(p.horaInicio);
        if (d > 0) duracionesClase.push(d);
      }
    }

    // Si no hay bloques ni grilla propuesta, no generamos filas artificiales
    if (puntos.size === 0) {
      return {
        franjas: [],
        duracionBaseClase: undefined,
        tieneContenido: false,
      };
    }

    // La duración base es la duración mínima de una clase ordinaria (ej. 45 minutos)
    const duracionBaseClase = duracionesClase.length > 0 ? Math.min(...duracionesClase) : undefined;

    const minutosOrdenados = Array.from(puntos)
      .map(convertirHoraAMinutos)
      .sort((a, b) => a - b);

    const minutosUnicos: number[] = [];
    for (const m of minutosOrdenados) {
      if (minutosUnicos.length === 0 || minutosUnicos[minutosUnicos.length - 1] !== m) {
        minutosUnicos.push(m);
      }
    }

    const franjas: FranjaHoraria[] = [];
    for (let i = 0; i < minutosUnicos.length - 1; i++) {
      const minIni = minutosUnicos[i]!;
      const minFin = minutosUnicos[i + 1]!;
      if (minFin > minIni) {
        franjas.push({
          inicio: minutosAHora(minIni),
          fin: minutosAHora(minFin),
          minInicio: minIni,
          minFin: minFin,
        });
      }
    }

    return {
      franjas,
      duracionBaseClase,
      tieneContenido: franjas.length > 0,
    };
  }, [bloques, bloquesPropuestos]);
}
