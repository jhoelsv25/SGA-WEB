import {
  Home01Icon,
  TeacherIcon,
  Award01Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  BookOpen01Icon,
  UserGroupIcon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import type { NavSection } from "./types";

export const teacherNavigation: NavSection[] = [
  {
    items: [
      {
        id: "teacher-dashboard",
        label: "Inicio",
        link: "/dashboard",
        icon: Home01Icon,
        permissions: ["teacher:dashboard:view"],
        roles: ["teacher"],
        exact: true,
        description: "Resumen de mis clases del día y alertas",
      },
    ],
  },
  {
    title: "Gestión Pedagógica",
    items: [
      {
        id: "teacher-courses",
        label: "Mis Cursos a Cargo",
        link: "/dashboard/teacher/courses",
        icon: TeacherIcon,
        permissions: ["teacher:courses:view"],
        roles: ["teacher"],
        badge: { text: "Activo", variant: "default" },
        description: "Asignaturas, grados y secciones asignadas",
      },
      {
        id: "teacher-curriculum",
        label: "Planificación Curricular",
        link: "/dashboard/teacher/curriculum",
        icon: BookOpen01Icon,
        permissions: ["teacher:curriculum:manage"],
        roles: ["teacher"],
        description: "Unidades didácticas, sesiones y competencias CNEB",
      },
    ],
  },
  {
    title: "Evaluación y Control",
    items: [
      {
        id: "teacher-grades",
        label: "Registro de Notas",
        link: "/dashboard/teacher/grades",
        icon: Award01Icon,
        permissions: ["teacher:grades:manage"],
        roles: ["teacher"],
        badge: { text: "I Bimestre", variant: "info" },
        description: "Calificaciones literales y conclusiones descriptivas",
      },
      {
        id: "teacher-attendance",
        label: "Control de Asistencia",
        link: "/dashboard/teacher/attendance",
        icon: CheckmarkCircle02Icon,
        permissions: ["teacher:attendance:manage"],
        roles: ["teacher"],
        description: "Pase de asistencia diaria por sesión o periodo",
      },
      {
        id: "teacher-tasks",
        label: "Tareas y Actividades",
        link: "/dashboard/teacher/tasks",
        icon: File01Icon,
        permissions: ["teacher:tasks:manage"],
        roles: ["teacher"],
        description: "Publicación de tareas, rúbricas y revisión",
      },
      {
        id: "teacher-students",
        label: "Nómina de Estudiantes",
        link: "/dashboard/teacher/students",
        icon: UserGroupIcon,
        permissions: ["teacher:students:view"],
        roles: ["teacher"],
        description: "Listado de alumnos por sección y fichas",
      },
    ],
  },
  {
    title: "Agenda",
    items: [
      {
        id: "teacher-schedule",
        label: "Mi Horario Docente",
        link: "/dashboard/teacher/schedule",
        icon: Calendar03Icon,
        permissions: ["teacher:schedule:view"],
        roles: ["teacher"],
        description: "Horas pedagógicas y atención a familias",
      },
    ],
  },
];
