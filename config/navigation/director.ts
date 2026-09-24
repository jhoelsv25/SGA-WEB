import {
  DashboardSquare01Icon,
  Analytics01Icon,
  TeacherIcon,
  School01Icon,
  ChartHistogramIcon,
  Clock01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import type { NavSection } from "./types";

export const directorNavigation: NavSection[] = [
  {
    title: "Dirección Institucional",
    items: [
      {
        id: "director-dashboard",
        label: "Panel Directivo",
        link: "/dashboard",
        icon: DashboardSquare01Icon,
        permissions: ["director:dashboard:view"],
        roles: ["director"],
        exact: true,
        description: "Tablero ejecutivo e indicadores clave de la I.E.",
      },
      {
        id: "director-analytics",
        label: "Monitoreo y Métricas",
        link: "/dashboard/director/analytics",
        icon: Analytics01Icon,
        permissions: ["director:analytics:view"],
        roles: ["director"],
        badge: { text: "En vivo", variant: "success" },
        description: "Rendimiento escolar, deserción y cumplimiento pedagógico",
      },
    ],
  },
  {
    title: "Comunidad Escolar",
    items: [
      {
        id: "director-teachers",
        label: "Planta Docente",
        link: "/dashboard/director/teachers",
        icon: TeacherIcon,
        permissions: ["director:teachers:view", "director:teachers:manage"],
        roles: ["director"],
        description: "Distribución de carga horaria, asignaciones y supervisiones",
      },
      {
        id: "director-enrollment",
        label: "Matrícula y Vacantes",
        link: "/dashboard/director/enrollments",
        icon: School01Icon,
        permissions: ["director:enrollment:manage"],
        roles: ["director"],
        description: "Padrón general de estudiantes, secciones y vacantes",
      },
      {
        id: "director-attendance",
        label: "Asistencia Institucional",
        link: "/dashboard/director/attendance",
        icon: Clock01Icon,
        permissions: ["director:attendance:view"],
        roles: ["director"],
        description: "Consolidado de asistencia de estudiantes y docentes",
      },
    ],
  },
  {
    title: "Reportes Oficiales",
    items: [
      {
        id: "director-reports",
        label: "Reportes MINEDU / SIAGIE",
        link: "/dashboard/director/reports",
        icon: ChartHistogramIcon,
        permissions: ["director:reports:generate"],
        roles: ["director"],
        badge: "Oficial",
        description: "Actas consolidadas, nóminas y cuadros de mérito",
      },
      {
        id: "director-calendar",
        label: "Calendario Institucional",
        link: "/dashboard/director/calendar",
        icon: Calendar03Icon,
        permissions: ["director:calendar:manage"],
        roles: ["director"],
        description: "Jornadas de reflexión, semanas de gestión y feriados",
      },
    ],
  },
];
