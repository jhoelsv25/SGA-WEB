import {
  Home01Icon,
  UserGroupIcon,
  School01Icon,
  TeacherIcon,
  File01Icon,
  Award01Icon,
  Clock01Icon,
  Notification01Icon,
  CheckmarkCircle02Icon,
  Invoice01Icon,
} from "@hugeicons/core-free-icons";
import type { NavSection } from "./types";

/**
 * Navegación para el rol Secretaría
 * Definido en DB: Matrícula, nóminas, padrón de estudiantes, apoderados y docentes
 */
export const secretaryNavigation: NavSection[] = [
  {
    items: [
      {
        id: "secretary-dashboard",
        label: "Inicio",
        link: "/dashboard",
        icon: Home01Icon,
        permissions: ["secretary:dashboard:view"],
        roles: ["secretary", "secretaria"],
        exact: true,
        description: "Resumen de matrículas, vacantes y estado administrativo",
      },
    ],
  },
  {
    title: "Padrón Institucional",
    items: [
      {
        id: "secretary-students",
        label: "Padrón de Estudiantes",
        link: "/dashboard/secretary/students",
        icon: UserGroupIcon,
        permissions: ["students:view"],
        roles: ["secretary", "secretaria"],
        badge: { text: "Padrón", variant: "default" },
        description: "Fichas integrales de alumnos de 1.° a 5.° de secundaria",
      },
      {
        id: "secretary-parents",
        label: "Apoderados y Familias",
        link: "/dashboard/secretary/parents",
        icon: UserGroupIcon,
        permissions: ["parents:view"],
        roles: ["secretary", "secretaria"],
        description: "Datos de contacto, parentesco y apoderados legales",
      },
      {
        id: "secretary-teachers",
        label: "Planta Docente",
        link: "/dashboard/secretary/teachers",
        icon: TeacherIcon,
        permissions: ["teachers:view"],
        roles: ["secretary", "secretaria"],
        description: "Directorio de profesores y asignaciones de aula",
      },
      {
        id: "secretary-credentials",
        label: "Credenciales y Carnets",
        link: "/dashboard/secretary/credentials",
        icon: Invoice01Icon,
        permissions: ["credentials:manage"],
        roles: ["secretary", "secretaria"],
        description: "Códigos de barra, carnets y PIN de acceso escolar",
      },
    ],
  },
  {
    title: "Proceso de Matrícula",
    items: [
      {
        id: "secretary-enrollment",
        label: "Registro de Matrícula",
        link: "/dashboard/secretary/enrollment",
        icon: School01Icon,
        permissions: ["enrollment:manage"],
        roles: ["secretary", "secretaria"],
        badge: { text: "2026", variant: "success" },
        description: "Asignación de grado, sección y turno escolar",
      },
      {
        id: "secretary-transfers",
        label: "Traslados y Retiros",
        link: "/dashboard/secretary/transfers",
        icon: File01Icon,
        permissions: ["transfers:manage"],
        roles: ["secretary", "secretaria"],
        description: "Resoluciones de traslado e historial de matrícula",
      },
      {
        id: "secretary-rosters",
        label: "Nóminas Oficiales",
        link: "/dashboard/secretary/rosters",
        icon: CheckmarkCircle02Icon,
        permissions: ["rosters:generate"],
        roles: ["secretary", "secretaria"],
        description: "Generación de nóminas de matrícula para SIAGIE / UGEL",
      },
    ],
  },
  {
    title: "Documentación y Asistencia",
    items: [
      {
        id: "secretary-report-cards",
        label: "Libretas SIAGIE",
        link: "/dashboard/secretary/report-cards",
        icon: Award01Icon,
        permissions: ["report-cards:manage"],
        roles: ["secretary", "secretaria"],
        badge: "PDF",
        description: "Carga de libretas oficiales descargadas de SIAGIE",
      },
      {
        id: "secretary-attendance",
        label: "Control de Asistencia",
        link: "/dashboard/secretary/attendance",
        icon: Clock01Icon,
        permissions: ["attendance:view"],
        roles: ["secretary", "secretaria"],
        description: "Consolidado de asistencia y justificaciones médicas",
      },
      {
        id: "secretary-announcements",
        label: "Comunicados y Circulares",
        link: "/dashboard/secretary/announcements",
        icon: Notification01Icon,
        permissions: ["announcements:manage"],
        roles: ["secretary", "secretaria"],
        description: "Difusión de avisos a docentes, estudiantes y familias",
      },
    ],
  },
];

export const secretariaNavigation = secretaryNavigation;
