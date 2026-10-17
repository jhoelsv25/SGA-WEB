import {
  Home01Icon,
  TeacherIcon,
  Award01Icon,
  Clock01Icon,
  File01Icon,
  BookOpen01Icon,
  Calendar03Icon,
  Notification01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import type { NavSection } from "./types";

/**
 * Navegación para el rol Docente
 * Definido en DB: Sesiones de clase, libretas y aula virtual de sus cursos
 */
export const teacherNavigation: NavSection[] = [
  {
    items: [
      {
        id: "teacher-dashboard",
        label: "Inicio",
        link: "/dashboard",
        icon: Home01Icon,
        permissions: ["teacher:dashboard:view"],
        roles: ["teacher", "docente"],
        exact: true,
        description: "Mis clases programadas para hoy y pendientes",
      },
    ],
  },
  {
    title: "Sesiones y Clases",
    items: [
      {
        id: "teacher-sessions",
        label: "Firma de Sesión (Kiosko)",
        link: "/dashboard/teacher/sessions",
        icon: CheckmarkCircle02Icon,
        permissions: ["sessions:register"],
        roles: ["teacher", "docente"],
        badge: { text: "Firma PIN", variant: "success" },
        description: "Registro de ingreso y salida en kiosko de subdirección",
      },
      {
        id: "teacher-schedule",
        label: "Mi Horario y Carga",
        link: "/dashboard/teacher/schedule",
        icon: Calendar03Icon,
        permissions: ["teacher:schedule:view"],
        roles: ["teacher", "docente"],
        description: "Cronograma semanal de horas pedagógicas por sección",
      },
      {
        id: "teacher-courses",
        label: "Mis Secciones Asignadas",
        link: "/dashboard/teacher/courses",
        icon: TeacherIcon,
        permissions: ["teacher:courses:view"],
        roles: ["teacher", "docente"],
        badge: "2026",
        description: "Asignaturas, grados (1.° a 5.°) y nóminas de alumnos",
      },
    ],
  },
  {
    title: "Aula Virtual (Reforzamiento)",
    items: [
      {
        id: "teacher-materials",
        label: "Unidades y Materiales",
        link: "/dashboard/teacher/materials",
        icon: BookOpen01Icon,
        permissions: ["materials:manage"],
        roles: ["teacher", "docente"],
        description: "Guías didácticas, diapositivas y fichas de refuerzo",
      },
      {
        id: "teacher-tasks",
        label: "Tareas y Calificaciones",
        link: "/dashboard/teacher/tasks",
        icon: File01Icon,
        permissions: ["tasks:manage"],
        roles: ["teacher", "docente"],
        badge: { text: "Refuerzo", variant: "warning" },
        description: "Revisión de entregas y calificación del aula virtual",
      },
    ],
  },
  {
    title: "Libretas y Asistencia",
    items: [
      {
        id: "teacher-report-cards",
        label: "Subir Libretas SIAGIE",
        link: "/dashboard/teacher/report-cards",
        icon: Award01Icon,
        permissions: ["report-cards:upload"],
        roles: ["teacher", "docente"],
        badge: "PDF Oficial",
        description: "Carga de libretas oficiales descargadas del SIAGIE",
      },
      {
        id: "teacher-attendance",
        label: "Asistencia de Alumnos",
        link: "/dashboard/teacher/attendance",
        icon: Clock01Icon,
        permissions: ["attendance:register"],
        roles: ["teacher", "docente"],
        description: "Pase de asistencia en aula por sesión pedagógica",
      },
      {
        id: "teacher-announcements",
        label: "Avisos y Conducta",
        link: "/dashboard/teacher/announcements",
        icon: Notification01Icon,
        permissions: ["announcements:view"],
        roles: ["teacher", "docente"],
        description: "Registro de incidencias de conducta y circulares",
      },
      {
        id: "teacher-calendar",
        label: "Calendario escolar",
        link: "/admin/calendario",
        icon: Calendar03Icon,
        roles: ["teacher", "docente"],
        description: "Feriados, suspensiones y días sin clases",
      },
    ],
  },
];

export const docenteNavigation = teacherNavigation;
