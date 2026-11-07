import {
  School01Icon,
  SlidersHorizontalIcon,
  Clock01Icon,
  ComputerIcon,
  SecurityLockIcon,
  Notification01Icon,
} from "@hugeicons/core-free-icons";
import type { ItemMenuConfig } from "./types";

export const MENU_ITEMS: ItemMenuConfig[] = [
  {
    id: "institucion",
    label: "Institución y Sede",
    descripcion: "Identificación, códigos y ubicación",
    icono: School01Icon,
    grupo: "general",
  },
  {
    id: "variables",
    label: "Variables y Reglas",
    descripcion: "Tolerancias, plazos y asistencias",
    icono: SlidersHorizontalIcon,
    grupo: "general",
  },
  {
    id: "turnos",
    label: "Turnos y Horarios",
    descripcion: "Jornadas, entrada y salida oficial",
    icono: Clock01Icon,
    grupo: "general",
  },
  {
    id: "equipos",
    label: "Equipos en Red",
    descripcion: "Kioskos y terminales autorizados",
    icono: ComputerIcon,
    grupo: "general",
  },
  {
    id: "seguridad",
    label: "Seguridad y Cuentas",
    descripcion: "Políticas de contraseñas y bloqueos",
    icono: SecurityLockIcon,
    grupo: "politicas",
  },
  {
    id: "notificaciones",
    label: "Notificaciones",
    descripcion: "Avisos por inasistencia y alertas",
    icono: Notification01Icon,
    grupo: "politicas",
  },
];
