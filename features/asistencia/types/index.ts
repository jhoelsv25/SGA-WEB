import type { ResultadoMarcacionApi } from "@/features/marcaciones/types";

export type EstadoAsistencia = "presente" | "tardanza" | "falta" | "falta_justificada";
export type EstadoMarcableDocente = "presente" | "tardanza" | "falta";

export interface EstudianteListaAsistencia {
  matriculaId: string;
  estudianteId: string;
  nombreCompleto: string;
  fotoUrl: string | null;
  estado: EstadoAsistencia;
  asistenciaId: string | null;
  noMarcoIngreso: boolean;
  justificacion: string | null;
}

export interface ListaAsistenciaSesion {
  sesionId: string;
  fecha: string;
  cursoSeccionId: string;
  cursoNombre: string;
  seccionNombre: string;
  editable: boolean;
  estudiantes: EstudianteListaAsistencia[];
}

export interface ResumenAsistencia {
  presentes: number;
  tardanzas: number;
  faltas: number;
  faltasJustificadas: number;
}

export interface GuardarAsistenciaRespuesta {
  mensaje: string;
  resumen: ResumenAsistencia;
}

export interface ExcepcionAsistencia {
  matriculaId: string;
  estado: EstadoMarcableDocente;
}

export interface EntradaColegio {
  fecha: string;
  hora: string;
  resultado: ResultadoMarcacionApi;
  minutosTardanza: number;
  justificada: boolean;
}

export interface IncidenciaCurso {
  id: string;
  fecha: string;
  estado: EstadoAsistencia;
  justificacion: string | null;
}

export interface AsistenciaCurso {
  cursoSeccionId: string;
  cursoNombre: string;
  totales: ResumenAsistencia;
  incidencias: IncidenciaCurso[];
}

export interface AsistenciaEstudiante {
  estudianteId: string;
  nombreCompleto: string;
  desde: string;
  hasta: string;
  colegio: {
    entradas: EntradaColegio[];
    faltasAlColegio: string[];
    puntuales: number;
    tardanzas: number;
    fueraDeTurno: number;
  };
  cursos: AsistenciaCurso[];
}

export interface ResumenEstudianteSeccion {
  estudianteId: string;
  nombreCompleto: string;
  faltasColegio: number;
  tardanzasColegio: number;
  clases: ResumenAsistencia;
}

export interface AsistenciaSeccion {
  seccionId: string;
  seccionNombre: string;
  desde: string;
  hasta: string;
  diasConClases: number;
  estudiantes: ResumenEstudianteSeccion[];
}

export interface SeccionConsultable {
  id: string;
  nombre: string;
}

export interface EstudianteVinculado {
  estudianteId: string;
  nombreCompleto: string;
  seccion: string | null;
}

export interface RangoFechas {
  desde: string;
  hasta: string;
}
