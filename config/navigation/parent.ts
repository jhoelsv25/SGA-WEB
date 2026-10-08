import {
  Home01Icon,
  UserIcon,
  Award01Icon,
  Clock01Icon,
  Calendar03Icon,
  Notification01Icon,
  Invoice01Icon,
} from "@hugeicons/core-free-icons";
import type { NavSection } from "./types";

/**
 * Navegación para el rol Apoderado
 * Definido en DB: Consulta de libretas, asistencia y comunicados de sus hijos
 */
export const parentNavigation: NavSection[] = [
  {
    items: [
      {
        id: "parent-dashboard",
        label: "Inicio",
        link: "/dashboard",
        icon: Home01Icon,
        permissions: ["parent:dashboard:view"],
        roles: ["parent", "apoderado"],
        exact: true,
        description: "Resumen de rendimiento y asistencia de mis hijos",
      },
    ],
  },
  {
    title: "Seguimiento Familiar",
    items: [
      {
        id: "parent-children",
        label: "Mis Hijos Matriculados",
        link: "/dashboard/parent/children",
        icon: UserIcon,
        permissions: ["parent:children:view"],
        roles: ["parent", "apoderado"],
        badge: { text: "2026", variant: "default" },
        description: "Fichas de estudiantes a cargo y datos de su sección",
      },
    ],
  },
  {
    title: "Progreso y Asistencia",
    items: [
      {
        id: "parent-report-cards",
        label: "Libretas SIAGIE Oficiales",
        link: "/dashboard/parent/report-cards",
        icon: Award01Icon,
        permissions: ["parent:grades:view"],
        roles: ["parent", "apoderado"],
        badge: "PDF",
        description: "Boletas oficiales de notas bimestrales descargables",
      },
      {
        id: "parent-attendance",
        label: "Asistencia y Puntualidad",
        link: "/dashboard/parent/attendance",
        icon: Clock01Icon,
        permissions: ["parent:attendance:view"],
        roles: ["parent", "apoderado"],
        description: "Registro de ingresos al colegio, tardanzas y justificaciones",
      },
      {
        id: "parent-schedule",
        label: "Horarios de Mis Hijos",
        link: "/dashboard/parent/schedule",
        icon: Calendar03Icon,
        permissions: ["parent:schedule:view"],
        roles: ["parent", "apoderado"],
        description: "Horario semanal de clases y horas pedagógicas",
      },
    ],
  },
  {
    title: "Comunicación y Trámites",
    items: [
      {
        id: "parent-communications",
        label: "Citaciones y Comunicados",
        link: "/dashboard/parent/communications",
        icon: Notification01Icon,
        permissions: ["parent:communications:view"],
        roles: ["parent", "apoderado"],
        badge: { text: "Circulares", variant: "warning" },
        description: "Avisos de docentes, dirección y citaciones a reuniones",
      },
      {
        id: "parent-administrative",
        label: "Estado de Matrícula",
        link: "/dashboard/parent/administrative",
        icon: Invoice01Icon,
        permissions: ["parent:administrative:view"],
        roles: ["parent", "apoderado"],
        description: "Ficha de matrícula escolar y solicitud de constancias",
      },
      {
        id: "parent-calendar",
        label: "Calendario escolar",
        link: "/admin/calendario",
        icon: Calendar03Icon,
        roles: ["parent", "apoderado"],
        description: "Feriados, suspensiones y días sin clases",
      },
    ],
  },
];

export const apoderadoNavigation = parentNavigation;
