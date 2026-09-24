import {
  Home01Icon,
  Analytics01Icon,
  TeacherIcon,
  School01Icon,
  ChartHistogramIcon,
  Clock01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import type { NavSection } from "./types";

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
        description: "Tablero ejecutivo e indicadores clave de la I.E.",
      },
    ],
  },
  {
    title: "Dirección Institucional",
    items: [
      {
        id: "principal-analytics",
        label: "Monitoreo y Métricas",
        link: "/dashboard/principal/analytics",
        icon: Analytics01Icon,
        permissions: ["principal:analytics:view", "director:analytics:view"],
        roles: ["principal", "director"],
        badge: { text: "En vivo", variant: "success" },
        description: "Rendimiento escolar, deserción y cumplimiento pedagógico",
      },
    ],
  },
  {
    title: "Comunidad Escolar",
    items: [
      {
        id: "principal-teachers",
        label: "Planta Docente",
        link: "/dashboard/principal/teachers",
        icon: TeacherIcon,
        permissions: [
          "principal:teachers:view",
          "principal:teachers:manage",
          "director:teachers:view",
        ],
        roles: ["principal", "director"],
        description: "Distribución de carga horaria, asignaciones y supervisiones",
      },
      {
        id: "principal-enrollment",
        label: "Matrícula y Vacantes",
        link: "/dashboard/principal/enrollments",
        icon: School01Icon,
        permissions: ["principal:enrollment:manage", "director:enrollment:manage"],
        roles: ["principal", "director"],
        description: "Padrón general de estudiantes, secciones y vacantes",
      },
      {
        id: "principal-attendance",
        label: "Asistencia Institucional",
        link: "/dashboard/principal/attendance",
        icon: Clock01Icon,
        permissions: ["principal:attendance:view", "director:attendance:view"],
        roles: ["principal", "director"],
        description: "Consolidado de asistencia de estudiantes y docentes",
      },
    ],
  },
  {
    title: "Reportes Oficiales",
    items: [
      {
        id: "principal-reports",
        label: "Reportes MINEDU / SIAGIE",
        link: "/dashboard/principal/reports",
        icon: ChartHistogramIcon,
        permissions: ["principal:reports:generate", "director:reports:generate"],
        roles: ["principal", "director"],
        badge: "Oficial",
        description: "Actas consolidadas, nóminas y cuadros de mérito",
      },
      {
        id: "principal-calendar",
        label: "Calendario Institucional",
        link: "/dashboard/principal/calendar",
        icon: Calendar03Icon,
        permissions: ["principal:calendar:manage", "director:calendar:manage"],
        roles: ["principal", "director"],
        description: "Jornadas de reflexión, semanas de gestión y feriados",
      },
    ],
  },
];

// Alias para compatibilidad en español
export const directorNavigation = principalNavigation;
