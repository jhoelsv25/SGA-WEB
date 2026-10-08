import {
  Home01Icon,
  Book02Icon,
  Award01Icon,
  Clock01Icon,
  Calendar03Icon,
  File01Icon,
  Notification01Icon,
} from "@hugeicons/core-free-icons";
import type { NavSection } from "./types";

/**
 * Navegación para el rol Estudiante
 * Definido en DB: Aula virtual, libretas y asistencia propias
 */
export const studentNavigation: NavSection[] = [
  {
    items: [
      {
        id: "student-dashboard",
        label: "Inicio",
        link: "/dashboard",
        icon: Home01Icon,
        permissions: ["student:dashboard:view"],
        roles: ["student", "estudiante"],
        exact: true,
        description: "Mis asignaturas del día y tareas pendientes",
      },
    ],
  },
  {
    title: "Aula Virtual (Reforzamiento)",
    items: [
      {
        id: "student-courses",
        label: "Mis Asignaturas",
        link: "/dashboard/student/courses",
        icon: Book02Icon,
        permissions: ["student:courses:view"],
        roles: ["student", "estudiante"],
        badge: "Secundaria",
        description: "Cursos del plan de estudios y docentes a cargo",
      },
      {
        id: "student-materials",
        label: "Materiales y Guías",
        link: "/dashboard/student/materials",
        icon: File01Icon,
        permissions: ["student:materials:view"],
        roles: ["student", "estudiante"],
        description: "Descarga de fichas de trabajo y recursos de estudio",
      },
      {
        id: "student-tasks",
        label: "Tareas y Entregas",
        link: "/dashboard/student/tasks",
        icon: File01Icon,
        permissions: ["student:tasks:view"],
        roles: ["student", "estudiante"],
        badge: { text: "Refuerzo", variant: "warning" },
        description: "Envío de actividades y revisión de calificaciones",
      },
    ],
  },
  {
    title: "Mis Calificaciones y Asistencia",
    items: [
      {
        id: "student-report-cards",
        label: "Mis Libretas SIAGIE",
        link: "/dashboard/student/report-cards",
        icon: Award01Icon,
        permissions: ["student:report-cards:view"],
        roles: ["student", "estudiante"],
        badge: "PDF Oficial",
        description: "Libretas bimestrales emitidas y descargables",
      },
      {
        id: "student-attendance",
        label: "Mi Asistencia",
        link: "/dashboard/student/attendance",
        icon: Clock01Icon,
        permissions: ["student:attendance:view"],
        roles: ["student", "estudiante"],
        description: "Historial de ingresos, puntualidad y tardanzas",
      },
      {
        id: "student-schedule",
        label: "Mi Horario Escolar",
        link: "/dashboard/student/schedule",
        icon: Calendar03Icon,
        permissions: ["student:schedule:view"],
        roles: ["student", "estudiante"],
        description: "Horario de clases semanal por sección",
      },
    ],
  },
  {
    title: "Comunicación",
    items: [
      {
        id: "student-announcements",
        label: "Comunicados Escolares",
        link: "/dashboard/student/announcements",
        icon: Notification01Icon,
        permissions: ["student:announcements:view"],
        roles: ["student", "estudiante"],
        description: "Avisos del colegio, circulares y eventos",
      },
    ],
  },
];

export const estudianteNavigation = studentNavigation;
