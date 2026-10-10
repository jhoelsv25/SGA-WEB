export interface DocenteCargaItem {
  id: string;
  codigo: string;
  nombreCompleto: string;
}

export interface CargaItem {
  id: string;
  cursoId: string;
  cursoNombre: string;
  colorHex: string | null;
  horasPlan: number;
  horasHorario: number;
  docente: DocenteCargaItem | null;
}

export interface CargaSeccionResponse {
  seccionId: string;
  items: CargaItem[];
}

export interface CargaDocenteResumen {
  horasAsignadas: number;
  jornadaHoras: number;
  excede: boolean;
}

export interface AsignarDocentePayload {
  docenteId: string | null;
  confirmarExceso?: boolean;
}

export interface AsignarDocenteResultado {
  item: CargaItem;
  cargaDocente: CargaDocenteResumen;
}

export interface CursoDocenteItem {
  cursoSeccionId: string;
  cursoNombre: string;
  seccionId: string;
  gradoNumero: number;
  seccionNombre: string;
  horas: number;
}

export interface CargaDocenteDetalle {
  docenteId: string;
  jornadaHoras: number;
  horasAsignadas: number;
  excede: boolean;
  cursos: CursoDocenteItem[];
}

export interface SeccionTutorResumen {
  id: string;
  codigo: string;
  nombreCompleto: string;
}

export interface SeccionDetalleHeader {
  id: string;
  anioAcademicoId: string;
  gradoId: string;
  gradoNumero: number;
  gradoNombre: string;
  nombre: string;
  aula: string | null;
  vacantes: number;
  estado: string;
  tutor: SeccionTutorResumen | null;
  matriculados: number;
  totalCursos: number;
  cursosSinDocente: number;
}
