import {
  DashboardSquare01Icon,
  Book02Icon,
  Award01Icon,
  Clock01Icon,
  Calendar03Icon,
  File01Icon,
  HelpCircleIcon,
} from "@hugeicons/core-free-icons";
import type { NavSection } from "./types";

export const studentNavigation: NavSection[] = [
  {
    title: "Mi Aprendizaje",
    items: [
      {
        id: "student-dashboard",
        label: "Panel del Estudiante",
        link: "/dashboard",
        icon: DashboardSquare01Icon,
        permissions: ["student:dashboard:view"],
        roles: ["student"],
        exact: true,
        description: "Resumen de mis clases y tareas próximas",
      },
      {
        id: "student-courses",
        label: "Mis Asignaturas",
        link: "/dashboard/student/courses",
        icon: Book02Icon,
        permissions: ["student:courses:view"],
        roles: ["student"],
        badge: "2026",
        description: "Acceso a mis cursos, docentes y materiales",
        items: [
          {
            id: "student-courses-list",
            label: "Cursos Activos",
            link: "/dashboard/student/courses",
            icon: Book02Icon,
            permissions: ["student:courses:view"],
            roles: ["student"],
          },
          {
            id: "student-materials",
            label: "Materiales y Guías",
            link: "/dashboard/student/materials",
            icon: File01Icon,
            permissions: ["student:materials:view"],
            roles: ["student"],
          },
        ],
      },
      {
        id: "student-tasks",
        label: "Tareas y Evaluaciones",
        link: "/dashboard/student/tasks",
        icon: File01Icon,
        permissions: ["student:tasks:view"],
        roles: ["student"],
        badge: { text: "3 pend.", variant: "warning" },
        description: "Entregas, actividades y exámenes programados",
      },
    ],
  },
  {
    title: "Rendimiento y Asistencia",
    items: [
      {
        id: "student-grades",
        label: "Mis Calificaciones",
        link: "/dashboard/student/grades",
        icon: Award01Icon,
        permissions: ["student:grades:view"],
        roles: ["student"],
        description: "Boleta de notas y evaluación por competencias",
      },
      {
        id: "student-attendance",
        label: "Registro de Asistencia",
        link: "/dashboard/student/attendance",
        icon: Clock01Icon,
        permissions: ["student:attendance:view"],
        roles: ["student"],
        description: "Puntualidad, asistencias y justificaciones",
      },
      {
        id: "student-schedule",
        label: "Horario de Clases",
        link: "/dashboard/student/schedule",
        icon: Calendar03Icon,
        permissions: ["student:schedule:view"],
        roles: ["student"],
        description: "Cronograma semanal de asignaturas",
      },
    ],
  },
  {
    title: "Apoyo Estudiantil",
    items: [
      {
        id: "student-help",
        label: "Tutoría y Orientación",
        link: "/dashboard/student/tutoring",
        icon: HelpCircleIcon,
        permissions: ["student:tutoring:view"],
        roles: ["student"],
        description: "Consultas con mi tutor y orientación al estudiante",
      },
    ],
  },
];
