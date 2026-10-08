import {
  Home01Icon,
  Analytics01Icon,
  TeacherIcon,
  School01Icon,
  ChartHistogramIcon,
  Clock01Icon,
  Calendar03Icon,
  Award01Icon,
  File01Icon,
  Notification01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import type { NavSection } from "./types";

/**
 * Navegación para el rol Director
 * Definido en DB: Seguimiento docente, supervisión de sesiones, monitoreo y reportes
 */
export const principalNavigation: NavSection[] = [
  {
    items: [
      {
        id: "principal-dashboard",
        label: "Inicio",
        link: "/dashboard",
        icon: Home01Icon,
        permissions: ["principal:dashboard:view", "director:dashboard:view"],
        roles: ["principal", "director"],
        exact: true,
        description: "Tablero ejecutivo y estado general de la institución",
      },
    ],
  },
  {
    title: "Seguimiento Docente (CSP)",
    items: [
      {
        id: "principal-sessions-live",
        label: "Monitoreo en Vivo",
        link: "/dashboard/principal/sessions-live",
        icon: Analytics01Icon,
        permissions: ["principal:sessions:view", "director:sessions:view"],
        roles: ["principal", "director"],
        badge: { text: "En vivo", variant: "success" },
        description: "Control en tiempo real de sesiones firmadas en kiosko",
      },
      {
        id: "principal-absences",
        label: "Supervisión y Ausencias",
        link: "/dashboard/principal/teacher-absences",
        icon: TeacherIcon,
        permissions: ["principal:absences:manage", "director:absences:manage"],
        roles: ["principal", "director"],
        description: "Registro de tramos sin docente y evidencias fotográficas",
      },
      {
        id: "principal-consolidated",
        label: "Consolidados Docente",
        link: "/dashboard/principal/teacher-consolidated",
        icon: CheckmarkCircle02Icon,
        permissions: ["principal:consolidated:view", "director:consolidated:view"],
        roles: ["principal", "director"],
        badge: { text: "CSP", variant: "default" },
        description: "Fichas bimestrales de cumplimiento y horas efectivas",
      },
    ],
  },
  {
    title: "Gestión Institucional",
    items: [
      {
        id: "principal-schedules",
        label: "Carga Horaria y Horarios",
        link: "/dashboard/principal/schedules",
        icon: Calendar03Icon,
        permissions: ["principal:schedules:view", "director:schedules:view"],
        roles: ["principal", "director"],
        description: "Distribución de cursos, docentes y aulas por turno",
      },
      {
        id: "principal-enrollment",
        label: "Matrícula y Vacantes",
        link: "/dashboard/principal/enrollments",
        icon: School01Icon,
        permissions: ["principal:enrollment:manage", "director:enrollment:manage"],
        roles: ["principal", "director"],
        description: "Nóminas de estudiantes y disponibilidad de vacantes",
      },
      {
        id: "principal-attendance",
        label: "Asistencia Escolar",
        link: "/dashboard/principal/attendance",
        icon: Clock01Icon,
        permissions: ["principal:attendance:view", "director:attendance:view"],
        roles: ["principal", "director"],
        description: "Reporte de puntualidad y asistencia diaria de alumnos",
      },
    ],
  },
  {
    title: "Evaluación y Aula Virtual",
    items: [
      {
        id: "principal-report-cards",
        label: "Libretas SIAGIE (ISA)",
        link: "/dashboard/principal/report-cards",
        icon: Award01Icon,
        permissions: ["principal:reports:view", "director:reports:view"],
        roles: ["principal", "director"],
        badge: { text: "ISA", variant: "info" },
        description: "Supervisión de libretas oficiales publicadas por sección",
      },
      {
        id: "principal-virtual-classroom",
        label: "Supervisión Aula Virtual (IGM)",
        link: "/dashboard/principal/virtual-classroom",
        icon: File01Icon,
        permissions: ["principal:classroom:view", "director:classroom:view"],
        roles: ["principal", "director"],
        badge: { text: "IGM", variant: "warning" },
        description: "Cumplimiento en publicación de materiales y tareas",
      },
      {
        id: "principal-communications",
        label: "Comunicados y Convivencia",
        link: "/dashboard/principal/announcements",
        icon: Notification01Icon,
        permissions: ["principal:announcements:manage", "director:announcements:manage"],
        roles: ["principal", "director"],
        description: "Circulares escolares e incidencias de conducta",
      },
    ],
  },
  {
    title: "Métricas de la Tesis",
    items: [
      {
        id: "principal-analytics",
        label: "Indicadores Oficiales",
        link: "/dashboard/principal/analytics",
        icon: ChartHistogramIcon,
        permissions: ["principal:analytics:view", "director:analytics:view"],
        roles: ["principal", "director"],
        badge: { text: "CSP·ISA·IGM", variant: "default" },
        description: "Panel de indicadores cuantitativos de la investigación",
      },
      {
        id: "principal-calendar",
        label: "Calendario Cívico Escolar",
        link: "/dashboard/principal/calendar",
        icon: Calendar03Icon,
        permissions: ["principal:calendar:manage", "director:calendar:manage"],
        roles: ["principal", "director"],
        description: "Semanas lectivas, feriados y jornadas de gestión",
      },
    ],
  },
];

// Alias para compatibilidad en español
export const directorNavigation = principalNavigation;
