import type { HTMLAttributes, ReactNode } from "react";

/**
 * Tonos semánticos disponibles para el indicador de estado.
 */
export type StatusBadgeTone = "success" | "warning" | "danger" | "info" | "neutral" | "brand";

/**
 * Escala de tamaños del indicador de estado.
 * - `sm`: Texto de 12 px (text-xs) y altura compacta (h-5).
 * - `md`: Texto de 14 px (text-sm) y altura ergonómica (h-6).
 */
export type StatusBadgeSize = "sm" | "md";

/**
 * Propiedades para el componente `StatusBadge`.
 */
export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Tono semántico que define el color y propósito del indicador.
   */
  tone: StatusBadgeTone;
  /**
   * Contenido del badge (etiqueta de texto o elementos reactivos).
   */
  children: ReactNode;
  /**
   * Indica si se muestra un punto circular decorativo estático (sin animación) previo al texto.
   * @default false
   */
  dot?: boolean;
  /**
   * Tamaño del badge y escala tipográfica (sm = 12 px, md = 14 px).
   * @default "sm"
   */
  size?: StatusBadgeSize;
  /**
   * Clases CSS adicionales para extender o personalizar los estilos.
   */
  className?: string;
}
