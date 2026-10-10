import type * as React from "react";
import type { IconSvgElement } from "@hugeicons/react";

/**
 * Roles del sistema SGA institucional (basado en roles del modelo DB v3.2 / 0000_init.sql)
 * - Administrador: Acceso total al sistema
 * - Director: Seguimiento docente, supervisión de sesiones y reportes
 * - Secretaria: Matrícula, estudiantes y apoderados
 * - Docente: Sesiones de clase, libretas y aula virtual de sus cursos
 * - Estudiante: Aula virtual, libretas y asistencia propias
 * - Apoderado: Consulta de libretas, asistencia y comunicados de sus hijos
 */
export type UserRole =
  | "admin"
  | "principal"
  | "director"
  | "secretary"
  | "secretaria"
  | "teacher"
  | "docente"
  | "student"
  | "estudiante"
  | "parent"
  | "apoderado";

/**
 * Variante de color visual para el badge indicador del menú.
 */
export type NavBadgeVariant =
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";

export interface NavBadge {
  text: string;
  variant?: NavBadgeVariant;
  className?: string;
}

/**
 * Tipo unificado para iconos (HugeIcons IconSvgElement, componentes React o strings).
 */
export type NavIconType = IconSvgElement | React.ComponentType<{ className?: string }> | string;

/**
 * Elemento de navegación estándar del sistema.
 */
export interface NavItem {
  id: string;
  label: string;
  link: string;
  icon: NavIconType;
  permissions?: string[];
  roles?: UserRole[];
  badge?: NavBadge | string;
  description?: string;
  exact?: boolean;
  external?: boolean;
  disabled?: boolean;
  /** Opción de uso personal: el Administrador no la ve (los demás roles, según Roles-Menú). */
  ocultarAlAdministrador?: boolean;
  items?: NavItem[];
}

/**
 * Grupo o sección de navegación con título opcional.
 */
export interface NavSection {
  title?: string;
  items: NavItem[];
}
