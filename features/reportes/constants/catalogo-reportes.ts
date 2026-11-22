import type { IconSvgElement } from "@hugeicons/react";
import {
  Award01Icon,
  BookOpen01Icon,
  Calendar03Icon,
  CalendarClockIcon,
  ChartBarLineIcon,
  Clock01Icon,
  File01Icon,
  School01Icon,
  StudentIcon,
  Task01Icon,
  TeacherIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import type { CategoriaReporte, PermisosReportes, TipoReporteCola } from "../types";

export interface FiltrosConfigReporte {
  periodo?: boolean;
  periodoObligatorio?: boolean;
  grado?: boolean;
  seccion?: boolean;
  seccionObligatoria?: boolean;
  curso?: boolean;
  cursoObligatorio?: boolean;
  estadoMatricula?: boolean;
  tipoPersona?: boolean;
  tipoPersonal?: boolean;
  fechas?: boolean;
  mes?: boolean;
  busqueda?: boolean;
}

export interface ReporteCatalogoItem {
  id: string;
  categoria: CategoriaReporte;
  titulo: string;
  descripcion: string;
  icono: IconSvgElement;
  formatos: readonly ("excel" | "pdf")[];
  asincrono: boolean;
  tipoCola?: TipoReporteCola;
  chips: readonly string[];
  filtros: FiltrosConfigReporte;
  permitido: (p: PermisosReportes) => boolean;
}

export const CATALOGO_REPORTES: readonly ReporteCatalogoItem[] = [
  // ─── Académico y Matrícula ────────────────────────────────────────────────
  {
    id: "matriculas",
    categoria: "academico",
    titulo: "Nómina Oficial de Matrículas",
    descripcion:
      "Listado oficial de estudiantes matriculados con código, grado, sección, condición repitente y estado.",
    icono: School01Icon,
    formatos: ["excel"],
    asincrono: true,
    tipoCola: "matriculas",
    chips: ["Grado", "Sección", "Estado"],
    filtros: { grado: true, seccion: true, estadoMatricula: true, busqueda: true },
    permitido: (p) => p.puedeVerAcademico,
  },
  {
    id: "libretas",
    categoria: "academico",
    titulo: "Seguimiento de Libretas SIAGIE",
    descripcion:
      "Resumen de cumplimiento por sección (% a tiempo y vistas) más hoja de detalle por estudiante.",
    icono: Award01Icon,
    formatos: ["excel"],
    asincrono: true,
    tipoCola: "libretas",
    chips: ["Bimestre", "Grado", "Sección"],
    filtros: { periodo: true, periodoObligatorio: true, grado: true, seccion: true },
    permitido: (p) => p.puedeVerAcademico,
  },
  {
    id: "libro-notas",
    categoria: "academico",
    titulo: "Libro de Notas del Aula Virtual",
    descripcion:
      "Calificaciones de tareas y actividades evaluadas en el Aula Virtual por curso y sección.",
    icono: BookOpen01Icon,
    formatos: ["excel"],
    asincrono: false,
    chips: ["Sección", "Curso", "Bimestre"],
    filtros: {
      periodo: true,
      grado: true,
      seccion: true,
      seccionObligatoria: true,
      curso: true,
      cursoObligatorio: true,
    },
    permitido: (p) => p.puedeVerAcademico,
  },
  {
    id: "horario-seccion",
    categoria: "academico",
    titulo: "Horario Oficial de Sección",
    descripcion:
      "Grilla semanal lista para imprimir con bloques horarios, recreos, cursos y docentes.",
    icono: CalendarClockIcon,
    formatos: ["pdf"],
    asincrono: false,
    chips: ["Grado", "Sección"],
    filtros: { grado: true, seccion: true, seccionObligatoria: true },
    permitido: (p) => p.puedeVerAcademico,
  },

  // ─── Asistencia y Marcaciones ─────────────────────────────────────────────
  {
    id: "asistencia-seccion",
    categoria: "asistencia",
    titulo: "Asistencia Consolidada de Estudiantes",
    descripcion:
      "Faltas y tardanzas en puerta más presentes, tardanzas, faltas y justificadas por clase.",
    icono: School01Icon,
    formatos: ["excel"],
    asincrono: true,
    tipoCola: "asistencia-seccion",
    chips: ["Bimestre", "Grado", "Sección", "Fechas"],
    filtros: { periodo: true, grado: true, seccion: true, fechas: true },
    permitido: (p) => p.puedeVerAsistencia,
  },
  {
    id: "asistencia-personal",
    categoria: "asistencia",
    titulo: "Asistencia Consolidada de Docentes y Personal",
    descripcion:
      "Resumen por docente y administrativo: días asistidos, puntuales, tardanzas, minutos acumulados y faltas, más hoja detalle.",
    icono: TeacherIcon,
    formatos: ["excel"],
    asincrono: true,
    tipoCola: "asistencia-personal",
    chips: ["Bimestre", "Personal", "Fechas"],
    filtros: { periodo: true, tipoPersonal: true, fechas: true },
    permitido: (p) => p.puedeVerAsistencia,
  },
  {
    id: "marcaciones",
    categoria: "asistencia",
    titulo: "Marcaciones de Puerta",
    descripcion:
      "Detalle cronológico de ingresos y salidas (kiosko, biométrico y manual) con tardanzas.",
    icono: Calendar03Icon,
    formatos: ["excel"],
    asincrono: true,
    tipoCola: "marcaciones",
    chips: ["Bimestre", "Sección", "Perfil", "Fechas"],
    filtros: { periodo: true, grado: true, seccion: true, tipoPersona: true, fechas: true },
    permitido: (p) => p.puedeVerAsistencia,
  },

  // ─── Indicadores y Seguimiento Docente ────────────────────────────────────
  {
    id: "indicadores",
    categoria: "indicadores",
    titulo: "Indicadores de Gestión (CSP · ISA · IGM)",
    descripcion:
      "Informe formal con gráficos y datos crudos de sesiones planificadas, libretas y materiales.",
    icono: ChartBarLineIcon,
    formatos: ["excel", "pdf"],
    asincrono: false,
    chips: ["Bimestre", "Sección", "Fechas"],
    filtros: { periodo: true, grado: true, seccion: true, fechas: true },
    permitido: (p) => p.esDirectivo,
  },
  {
    id: "indicadores-apoyo",
    categoria: "indicadores",
    titulo: "Indicadores de Apoyo Docente",
    descripcion:
      "Ranking docente, evolución por bimestre y métricas complementarias de seguimiento.",
    icono: ChartBarLineIcon,
    formatos: ["excel"],
    asincrono: false,
    chips: ["Bimestre"],
    filtros: { periodo: true },
    permitido: (p) => p.esDirectivo,
  },
  {
    id: "observaciones-aula",
    categoria: "indicadores",
    titulo: "Matriz de Observaciones de Aula",
    descripcion:
      "Resultados vigentes por desempeño y cobertura de visitas pedagógicas por docente.",
    icono: Task01Icon,
    formatos: ["excel"],
    asincrono: false,
    chips: ["Bimestre"],
    filtros: { periodo: true },
    permitido: (p) => p.esDirectivo,
  },
  {
    id: "consolidado-docente",
    categoria: "indicadores",
    titulo: "Consolidado Bimestral Docente",
    descripcion:
      "Horas programadas, dictadas, ausencias y decisiones directivas del bimestre por docente.",
    icono: File01Icon,
    formatos: ["excel"],
    asincrono: false,
    chips: ["Bimestre"],
    filtros: { periodo: true, periodoObligatorio: true },
    permitido: (p) => p.esDirectivo,
  },
  {
    id: "horas-efectivas",
    categoria: "indicadores",
    titulo: "Informe Mensual de Horas Efectivas",
    descripcion:
      "Reporte mensual de horas pedagógicas efectivas y perdidas listo para Dirección y UGEL.",
    icono: Clock01Icon,
    formatos: ["excel"],
    asincrono: false,
    chips: ["Mes"],
    filtros: { mes: true },
    permitido: (p) => p.esDirectivo,
  },
  {
    id: "pendientes-seguimiento",
    categoria: "indicadores",
    titulo: "Pendientes de Seguimiento Docente",
    descripcion:
      "Justificaciones, descargos de ausencias, consolidados y compromisos aún por atender.",
    icono: Task01Icon,
    formatos: ["excel"],
    asincrono: false,
    chips: ["Bimestre"],
    filtros: { periodo: true },
    permitido: (p) => p.esDirectivo,
  },

  // ─── Padrones y Carnés ────────────────────────────────────────────────────
  {
    id: "carnes-seccion",
    categoria: "padrones",
    titulo: "Carnés de Estudiantes por Sección",
    descripcion:
      "Impresión oficial en PDF (8 carnés por hoja A4) con foto y código QR por estudiante.",
    icono: StudentIcon,
    formatos: ["pdf"],
    asincrono: false,
    chips: ["Grado", "Sección"],
    filtros: { grado: true, seccion: true, seccionObligatoria: true },
    permitido: (p) => p.esSecretaria,
  },
  {
    id: "carnes-docentes",
    categoria: "padrones",
    titulo: "Carnés de Plana Docente",
    descripcion:
      "Impresión oficial en PDF de credenciales activas con fotografía y código QR de docentes.",
    icono: TeacherIcon,
    formatos: ["pdf"],
    asincrono: false,
    chips: ["Plana completa"],
    filtros: {},
    permitido: (p) => p.esSecretaria,
  },
  {
    id: "estudiantes",
    categoria: "padrones",
    titulo: "Padrón de Estudiantes",
    descripcion:
      "Universo completo de estudiantes con código SIAGIE, datos personales, estado y usuario.",
    icono: StudentIcon,
    formatos: ["excel"],
    asincrono: true,
    tipoCola: "estudiantes",
    chips: ["Búsqueda"],
    filtros: { busqueda: true },
    permitido: (p) => p.esSecretaria,
  },
  {
    id: "docentes",
    categoria: "padrones",
    titulo: "Padrón de Docentes",
    descripcion:
      "Plana docente completa con contrato, jornada, especialidad, cargo vigente y usuario.",
    icono: TeacherIcon,
    formatos: ["excel"],
    asincrono: true,
    tipoCola: "docentes",
    chips: ["Búsqueda"],
    filtros: { busqueda: true },
    permitido: (p) => p.esSecretaria,
  },
  {
    id: "apoderados",
    categoria: "padrones",
    titulo: "Padrón de Apoderados",
    descripcion:
      "Registro completo de padres y tutores (una fila por vínculo familiar con su estudiante).",
    icono: UserGroupIcon,
    formatos: ["excel"],
    asincrono: true,
    tipoCola: "apoderados",
    chips: ["Búsqueda"],
    filtros: { busqueda: true },
    permitido: (p) => p.esSecretaria,
  },
  {
    id: "personas",
    categoria: "padrones",
    titulo: "Padrón General de Personas",
    descripcion:
      "Registro único de todas las personas del colegio con tipo de ficha y cargos vigentes.",
    icono: UserGroupIcon,
    formatos: ["excel"],
    asincrono: true,
    tipoCola: "personas",
    chips: ["Búsqueda"],
    filtros: { busqueda: true },
    permitido: (p) => p.esSecretaria,
  },
  {
    id: "usuarios",
    categoria: "padrones",
    titulo: "Usuarios del Sistema",
    descripcion:
      "Cuentas registradas, rol asignado, estado de acceso y fecha de último inicio de sesión.",
    icono: File01Icon,
    formatos: ["excel"],
    asincrono: true,
    tipoCola: "usuarios",
    chips: ["Solo Admin"],
    filtros: { busqueda: true },
    permitido: (p) => p.esAdmin,
  },
];
