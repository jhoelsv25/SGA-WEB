import {
  DashboardSquare01Icon,
  UserIcon,
  Award01Icon,
  Clock01Icon,
  Message01Icon,
  Invoice01Icon,
} from "@hugeicons/core-free-icons";
import type { NavSection } from "./types";

export const parentNavigation: NavSection[] = [
  {
    title: "Seguimiento Familiar",
    items: [
      {
        id: "parent-dashboard",
        label: "Panel del Apoderado",
        link: "/dashboard",
        icon: DashboardSquare01Icon,
        permissions: ["parent:dashboard:view"],
        roles: ["parent", "apoderado"],
        exact: true,
        description: "Resumen académico y asistencial de mis hijos",
      },
      {
        id: "parent-children",
        label: "Mis Hijos Matriculados",
        link: "/dashboard/parent/children",
        icon: UserIcon,
        permissions: ["parent:children:view"],
        roles: ["parent", "apoderado"],
        badge: { text: "2026", variant: "default" },
        description: "Selección de hijo, ficha escolar y datos del aula",
      },
    ],
  },
  {
    title: "Progreso del Estudiante",
    items: [
      {
        id: "parent-grades",
        label: "Calificaciones y Libreta",
        link: "/dashboard/parent/grades",
        icon: Award01Icon,
        permissions: ["parent:grades:view"],
        roles: ["parent", "apoderado"],
        description: "Notas por competencia, conclusiones y avance bimestral",
      },
      {
        id: "parent-attendance",
        label: "Reporte de Asistencia",
        link: "/dashboard/parent/attendance",
        icon: Clock01Icon,
        permissions: ["parent:attendance:view"],
        roles: ["parent", "apoderado"],
        description: "Control de ingresos, tardanzas e inasistencias",
      },
      {
        id: "parent-communications",
        label: "Citaciones y Comunicados",
        link: "/dashboard/parent/communications",
        icon: Message01Icon,
        permissions: ["parent:communications:view"],
        roles: ["parent", "apoderado"],
        badge: { text: "Avisos", variant: "warning" },
        description: "Mensajes de docentes, citaciones a reuniones y circulares",
      },
    ],
  },
  {
    title: "Secretaría y Trámites",
    items: [
      {
        id: "parent-administrative",
        label: "Constancias y Matrícula",
        link: "/dashboard/parent/administrative",
        icon: Invoice01Icon,
        permissions: ["parent:administrative:view"],
        roles: ["parent", "apoderado"],
        description: "Solicitud de certificados de estudios y estado de matrícula",
      },
    ],
  },
];

// Alias para compatibilidad en español
export const apoderadoNavigation = parentNavigation;
