import type {
  BloqueDocenteDto,
  BloqueHorarioDto,
  BloqueHorarioVista,
  FranjaHoraria,
} from "../types";

/**
 * Convierte una hora en formato "HH:mm" a minutos transcurridos desde medianoche.
 */
export function minutosDeHora(hora: string): number {
  const partes = hora.split(":");
  const h = Number(partes[0]) || 0;
  const m = Number(partes[1]) || 0;
  return h * 60 + m;
}

/**
 * Calcula la duración en minutos entre dos horas "HH:mm".
 */
export function calcularDuracionMinutos(horaInicio: string, horaFin: string): number {
  return Math.max(0, minutosDeHora(horaFin) - minutosDeHora(horaInicio));
}

/**
 * Genera la lista de franjas horarias atómicas ordenadas a partir de los puntos
 * de corte (inicio y fin) de todos los bloques presentes en el horario.
 * Sin valores fijos en el código: todo se deriva de la información devuelta por la API.
 */
export function calcularFranjasHorarias(bloques: readonly BloqueHorarioVista[]): FranjaHoraria[] {
  if (bloques.length === 0) return [];

  const puntosDeCorte = new Set<string>();
  for (const b of bloques) {
    puntosDeCorte.add(b.horaInicio);
    puntosDeCorte.add(b.horaFin);
  }

  const ordenados = Array.from(puntosDeCorte).sort((a, b) => minutosDeHora(a) - minutosDeHora(b));

  const franjas: FranjaHoraria[] = [];
  for (let i = 0; i < ordenados.length - 1; i++) {
    const inicio = ordenados[i];
    const fin = ordenados[i + 1];
    franjas.push({
      horaInicio: inicio,
      horaFin: fin,
      etiqueta: `${inicio} – ${fin}`,
    });
  }

  return franjas;
}

/**
 * Agrupa los bloques de la semana por día escolar (1 a 5), ordenados cronológicamente.
 */
export function agruparBloquesPorDia(
  bloques: readonly BloqueHorarioVista[],
): Map<number, BloqueHorarioVista[]> {
  const mapa = new Map<number, BloqueHorarioVista[]>();
  for (let dia = 1; dia <= 5; dia++) {
    mapa.set(dia, []);
  }

  for (const b of bloques) {
    const lista = mapa.get(b.diaSemana);
    if (lista) {
      lista.push(b);
    }
  }

  for (const [dia, lista] of mapa.entries()) {
    lista.sort((a, b) => minutosDeHora(a.horaInicio) - minutosDeHora(b.horaInicio));
    mapa.set(dia, lista);
  }

  return mapa;
}

/**
 * Transforma un bloque de docente devuelto por la API a la estructura de vista unificada.
 */
export function mapearBloqueDocenteAVista(b: BloqueDocenteDto): BloqueHorarioVista {
  const duracion = calcularDuracionMinutos(b.horaInicio, b.horaFin);
  return {
    id: b.id,
    diaSemana: b.diaSemana,
    horaInicio: b.horaInicio,
    horaFin: b.horaFin,
    tipoBloque: "clase",
    cursoNombre: b.cursoNombre ?? "Clase lectiva",
    colorHex: b.colorHex,
    subtitulo: `${b.gradoNumero}.° ${b.seccionNombre}`,
    aula: b.aula,
    duracionMinutos: duracion,
    esBloqueDoble: duracion > 50,
  };
}

/**
 * Transforma un bloque de sección/estudiante devuelto por la API a la estructura de vista unificada.
 */
export function mapearBloqueEstudianteAVista(b: BloqueHorarioDto): BloqueHorarioVista {
  const duracion = calcularDuracionMinutos(b.horaInicio, b.horaFin);
  const esReceso = b.tipoBloque === "receso";

  let subtitulo: string | null = null;
  if (!esReceso) {
    subtitulo = b.docenteNombre ? b.docenteNombre : "Docente por asignar";
  }

  return {
    id: b.id,
    diaSemana: b.diaSemana,
    horaInicio: b.horaInicio,
    horaFin: b.horaFin,
    tipoBloque: b.tipoBloque,
    cursoNombre: esReceso ? "Receso" : (b.cursoNombre ?? "Clase lectiva"),
    colorHex: esReceso ? null : b.colorHex,
    subtitulo,
    aula: b.aula,
    duracionMinutos: duracion,
    esBloqueDoble: !esReceso && duracion > 50,
  };
}

/**
 * Fusiona bloques contiguos idénticos (mismo día, mismo curso, misma aula,
 * donde el fin de uno coincide con el inicio del siguiente) para visualizarlos
 * como un único bloque doble o múltiple.
 */
export function unificarBloquesContiguos(
  bloques: readonly BloqueHorarioVista[],
): BloqueHorarioVista[] {
  if (bloques.length <= 1) return [...bloques];

  const resultado: BloqueHorarioVista[] = [];
  const agrupados = agruparBloquesPorDia(bloques);

  for (let dia = 1; dia <= 5; dia++) {
    const diaBloques = agrupados.get(dia) ?? [];
    if (diaBloques.length === 0) continue;

    let actual = { ...diaBloques[0] };

    for (let i = 1; i < diaBloques.length; i++) {
      const siguiente = diaBloques[i];
      const sonContiguos = actual.horaFin === siguiente.horaInicio;
      const mismoTipo = actual.tipoBloque === siguiente.tipoBloque;
      const mismoCurso = actual.cursoNombre === siguiente.cursoNombre;
      const mismaAula = (actual.aula ?? "") === (siguiente.aula ?? "");
      const mismoSubtitulo = (actual.subtitulo ?? "") === (siguiente.subtitulo ?? "");

      if (sonContiguos && mismoTipo && mismoCurso && mismaAula && mismoSubtitulo) {
        // Se unifica en un solo bloque continuo
        const duracionTotal = calcularDuracionMinutos(actual.horaInicio, siguiente.horaFin);
        actual = {
          ...actual,
          horaFin: siguiente.horaFin,
          duracionMinutos: duracionTotal,
          esBloqueDoble: duracionTotal > 50,
        };
      } else {
        resultado.push(actual);
        actual = { ...siguiente };
      }
    }
    resultado.push(actual);
  }

  return resultado.sort((a, b) => {
    if (a.diaSemana !== b.diaSemana) return a.diaSemana - b.diaSemana;
    return minutosDeHora(a.horaInicio) - minutosDeHora(b.horaInicio);
  });
}
