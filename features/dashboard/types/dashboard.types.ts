export interface PeriodoActualInfo {
  anioId: string;
  anio: number;
  periodoId?: string | null;
  periodoNombre?: string | null;
}

export interface DirectivoKpis {
  totalMatriculados: number;
  totalDocentes: number;
  totalSecciones: number;
  porcentajeAsistencia: number;
  asistenciaHoy: {
    presentes: number;
    tardanzas: number;
    faltas: number;
    justificados: number;
    totalEsperado: number;
    porcentaje: number;
  };
  aulaVirtual: {
    totalTareas: number;
    totalEntregas: number;
    tareasPendientesCalificar: number;
  };
  sesionesHoy: {
    programadas: number;
    completadas: number;
    enCurso: number;
    porcentajeCumplimiento: number;
  };
}

export interface DirectivoGraficoAsistencia {
  etiqueta: string;
  porcentaje: number;
  presentes: number;
  tardanzas: number;
  faltas: number;
}

export interface DirectivoDistribucionGrados {
  grado: string;
  matriculados: number;
  porcentaje: number;
}

export interface IndicadorTesisItem {
  codigo: "CSP" | "ISA" | "IGM";
  nombre: string;
  porcentaje: number;
  pretestPorcentaje?: number | null;
  variacionPuntos?: number | null;
  estado: "en_curso" | "cerrado" | "sin_datos";
}

export interface DirectivoAlertaDia {
  tipo: string;
  titulo: string;
  detalle: string;
  enlace: string;
  nivel: "info" | "warning" | "danger";
}

export interface DocenteSemaforoItem {
  docenteId: string;
  docenteNombre: string;
  porcentajeCumplimiento: number;
  estado: "verde" | "amarillo" | "rojo";
  sesionesRegistradas: number;
  totalSesiones: number;
}

export interface DirectivoDashboardData {
  kpis: DirectivoKpis;
  graficoAsistencia: DirectivoGraficoAsistencia[];
  distribucionGrados: DirectivoDistribucionGrados[];
  indicadoresTesis?: IndicadorTesisItem[];
  alertasDelDia?: DirectivoAlertaDia[];
  docentesSemaforo?: DocenteSemaforoItem[];
}

export interface DocenteKpis {
  misCursos: number;
  misSecciones: number;
  misEstudiantes: number;
  sesionesHoyTotal: number;
  sesionesHoyCompletadas: number;
  tareasActivas: number;
  entregasPendientesCalificar: number;
  porcentajeAsistenciaPromedio: number;
}

export interface DocenteEstadoEntregas {
  estado: string;
  cantidad: number;
  fill: string;
}

export interface DocenteSesionHoy {
  id: string;
  curso: string;
  seccion: string;
  grado: string;
  aula?: string | null;
  horaInicio: string;
  horaFin: string;
  estado: string;
}

export interface DocenteTareaResumen {
  id: string;
  titulo: string;
  curso: string;
  seccion: string;
  fechaLimite: string;
  entregadas: number;
  calificadas: number;
  totalAlumnos: number;
}

export interface DocenteDashboardData {
  kpis: DocenteKpis;
  graficoEntregas: DocenteEstadoEntregas[];
  sesionesHoy: DocenteSesionHoy[];
  tareasPorCorregir: DocenteTareaResumen[];
}

export interface EstudianteKpis {
  porcentajeAsistencia: number;
  presentes: number;
  tardanzas: number;
  faltas: number;
  justificadas: number;
  cursosInscritos: number;
  tareasPendientes: number;
  tareasEntregadas: number;
}

export interface EstudianteTareaProxima {
  id: string;
  titulo: string;
  curso: string;
  fechaLimite: string;
  tipo: string;
  puntajeMaximo: number;
  estadoEntrega: "pendiente" | "entregada" | "calificada";
  nota?: number | null;
}

export interface EstudianteHorarioClase {
  id: string;
  curso: string;
  docente?: string | null;
  aula?: string | null;
  horaInicio: string;
  horaFin: string;
  estado: string;
}

export interface EstudianteResumenTareasGrafico {
  estado: string;
  cantidad: number;
  fill: string;
}

export interface EstudianteAsociado {
  id: string;
  nombreCompleto: string;
  grado: string;
  seccion: string;
}

export interface EstudianteDashboardData {
  kpis: EstudianteKpis;
  graficoTareas: EstudianteResumenTareasGrafico[];
  proximasTareas: EstudianteTareaProxima[];
  horarioHoy: EstudianteHorarioClase[];
  estudiantesAsociados?: EstudianteAsociado[];
}

export interface AdminKpis {
  totalUsuarios: number;
  usuariosActivos: number;
  usuariosBloqueados: number;
  usuariosInactivos: number;
  intentosFallidosHoy: number;
  sinAcceso30Dias: number;
  totalEquipos: number;
  equiposActivos: number;
}

export interface DistribucionUsuariosRol {
  rol: string;
  cantidad: number;
  fill: string;
}

export interface AuditoriaRecienteItem {
  id: number;
  accion: string;
  tabla: string;
  usuarioNombre: string;
  fecha: string;
  ip?: string;
}

export interface AdminActividadSemanal {
  dia: string;
  fecha: string;
  totalEventos: number;
  iniciosSesion: number;
  cambios: number;
}

export interface AdminEquipoReciente {
  id: string;
  nombre: string;
  tipo: string;
  ultimoAcceso?: string;
  autorizado: boolean;
  activo: boolean;
}

export interface AdminServicioEstado {
  nombre: string;
  estado: "operacional" | "degradado" | "inactivo";
  detalle: string;
}

export interface AdminDashboardData {
  kpis: AdminKpis;
  distribucionRoles: DistribucionUsuariosRol[];
  ultimasAuditorias: AuditoriaRecienteItem[];
  actividadSemanal?: AdminActividadSemanal[];
  equiposRecientes?: AdminEquipoReciente[];
  servicios?: AdminServicioEstado[];
}

export interface SecretariaKpis {
  matriculasMes: number;
  retiradosMes: number;
  trasladadosMes: number;
  estudiantesSinApoderado: number;
  estudiantesSinDocumento: number;
  libretasPendientes: number;
  /** Null si hoy no se esperaba a ningún estudiante. */
  asistenciaHoyPorcentaje: number | null;
}

export interface SecretariaMatriculasGrado {
  grado: string;
  matriculados: number;
}

export interface SecretariaEstudianteAlerta {
  id: string;
  nombreCompleto: string;
  grado: string;
  seccion: string;
  tipoAlerta: "sin_apoderado" | "sin_documento";
}

export interface SecretariaComunicadoReciente {
  id: string;
  titulo: string;
  publicadoEn: string;
}

export interface SecretariaDashboardData {
  kpis: SecretariaKpis;
  matriculasPorGrado: SecretariaMatriculasGrado[];
  estudiantesConAlerta: SecretariaEstudianteAlerta[];
  comunicadosRecientes: SecretariaComunicadoReciente[];
}

export interface DashboardResponse {
  rolCategoria:
    "directivo" | "docente" | "estudiante" | "apoderado" | "admin" | "secretaria" | "adicional";
  rolNombre: string;
  periodoActual: PeriodoActualInfo;
  directivo?: DirectivoDashboardData;
  docente?: DocenteDashboardData;
  estudiante?: EstudianteDashboardData;
  admin?: AdminDashboardData;
  secretaria?: SecretariaDashboardData;
}

export interface DashboardFiltrosParams {
  anioAcademicoId?: string;
  periodoId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  estudianteId?: string;
}
