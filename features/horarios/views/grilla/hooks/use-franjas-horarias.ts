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

// Rango estándar de la jornada escolar (8:00 AM a 3:00 PM)
const HORA_INICIO_DEFECTO = 8 * 60; // 08:00 (480 min)
const HORA_FIN_DEFECTO = 15 * 60; // 15:00 (900 min)
const PASO_INTERVALO_MINUTOS = 15; // Granularidad de 15 minutos

/**
 * Hook para extraer las franjas horarias del horario escolar.
 * Si existen bloques, asegura que la grilla cubra la jornada completa (8:00 a 15:00)
 * en intervalos consistentes de 15 minutos para que los bloques largos (ej. 8:00 a 10:00)
 * y los recesos (15 o 30 min) ocupen exactamente su altura proporcional (rowSpan).
 */
export function useFranjasHorarias(
  bloques: BloqueHorario[],
  bloquesPropuestos: BloquePropuesta[],
): UseFranjasHorariasResult {
  return useMemo(() => {
    const tieneBloques = bloques.length > 0 || bloquesPropuestos.length > 0;

    // Si no hay bloques ni grilla propuesta, no generamos filas artificiales
    if (!tieneBloques) {
      return {
        franjas: [],
        duracionBaseClase: undefined,
        tieneContenido: false,
      };
    }

    const puntos = new Set<string>();
    const duracionesClase: number[] = [];

    let minInicio = HORA_INICIO_DEFECTO;
    let minFin = HORA_FIN_DEFECTO;

    for (const b of bloques) {
      puntos.add(b.horaInicio);
      puntos.add(b.horaFin);
      const bIni = convertirHoraAMinutos(b.horaInicio);
      const bFin = convertirHoraAMinutos(b.horaFin);
      if (bIni < minInicio)
        minInicio = Math.floor(bIni / PASO_INTERVALO_MINUTOS) * PASO_INTERVALO_MINUTOS;
      if (bFin > minFin) minFin = Math.ceil(bFin / PASO_INTERVALO_MINUTOS) * PASO_INTERVALO_MINUTOS;

      if (b.tipoBloque === "clase") {
        const d = bFin - bIni;
        if (d > 0) duracionesClase.push(d);
      }
    }

    for (const p of bloquesPropuestos) {
      puntos.add(p.horaInicio);
      puntos.add(p.horaFin);
      const pIni = convertirHoraAMinutos(p.horaInicio);
      const pFin = convertirHoraAMinutos(p.horaFin);
      if (pIni < minInicio)
        minInicio = Math.floor(pIni / PASO_INTERVALO_MINUTOS) * PASO_INTERVALO_MINUTOS;
      if (pFin > minFin) minFin = Math.ceil(pFin / PASO_INTERVALO_MINUTOS) * PASO_INTERVALO_MINUTOS;

      if (p.tipoBloque === "clase") {
        const d = pFin - pIni;
        if (d > 0) duracionesClase.push(d);
      }
    }

    // Generar franjas cada 15 minutos en toda la jornada escolar (ej. 08:00 a 15:00)
    for (let m = minInicio; m <= minFin; m += PASO_INTERVALO_MINUTOS) {
      puntos.add(minutosAHora(m));
    }

    // La duración base es la duración mínima de una clase ordinaria (ej. 45 minutos)
    const duracionBaseClase = duracionesClase.length > 0 ? Math.min(...duracionesClase) : 45;

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
