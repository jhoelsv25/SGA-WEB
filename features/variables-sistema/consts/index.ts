import type { IconSvgElement } from "@hugeicons/react";
import {
  ShieldCheckIcon,
  Audit01Icon,
  Clock02Icon,
  TeacherIcon,
  ComputerIcon,
  Award01Icon,
  SlidersHorizontalIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

export interface ModuloInfo {
  label: string;
  icon: IconSvgElement;
}

export const MODULO_CONFIG: Record<string, ModuloInfo> = {
  seguridad: {
    label: "Seguridad y Accesos",
    icon: ShieldCheckIcon,
  },
  auditoria: {
    label: "Bitácora y Auditoría",
    icon: Audit01Icon,
  },
  sesiones: {
    label: "Asistencia y Sesiones de Clase",
    icon: Clock02Icon,
  },
  supervision: {
    label: "Supervisión y Ausencias Docentes",
    icon: TeacherIcon,
  },
  aula_virtual: {
    label: "Aula Virtual y Calificación",
    icon: ComputerIcon,
  },
  libretas: {
    label: "Libretas del SIAGIE",
    icon: Award01Icon,
  },
  organizacion: {
    label: "Organización y Jornada Escolar",
    icon: SlidersHorizontalIcon,
  },
  consolidado: {
    label: "Consolidado y Ficha de Seguimiento",
    icon: Audit01Icon,
  },
  observacion: {
    label: "Observación de Aula",
    icon: TeacherIcon,
  },
  convivencia: {
    label: "Convivencia y Conducta",
    icon: UserGroupIcon,
  },
};
