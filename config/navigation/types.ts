import type * as React from "react";
import type { IconSvgElement } from "@hugeicons/react";

/**
 * Roles del sistema SGA institucional (estándar en inglés con alias en español).
 */
export type UserRole =
  "admin" | "principal" | "teacher" | "student" | "parent" | "director" | "apoderado";

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
  items?: NavItem[];
}

/**
 * Grupo o sección de navegación con título opcional.
 */
export interface NavSection {
  title?: string;
  items: NavItem[];
}
