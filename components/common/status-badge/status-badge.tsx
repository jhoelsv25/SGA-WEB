import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StatusBadgeProps, StatusBadgeSize, StatusBadgeTone } from "./types";

interface ToneStyleConfig {
  badgeVariant?: "success" | "warning" | "info" | "destructive" | "outline";
  extraBadgeClass?: string;
  dotClass: string;
}

const TONE_CONFIG: Record<StatusBadgeTone, ToneStyleConfig> = {
  success: {
    badgeVariant: "success",
    dotClass: "bg-success",
  },
  warning: {
    badgeVariant: "warning",
    dotClass: "bg-warning",
  },
  info: {
    badgeVariant: "info",
    dotClass: "bg-info",
  },
  danger: {
    badgeVariant: "destructive",
    extraBadgeClass: "border-destructive/25",
    dotClass: "bg-destructive",
  },
  neutral: {
    badgeVariant: "outline",
    extraBadgeClass: "border-border/60 bg-muted/60 text-muted-foreground",
    dotClass: "bg-muted-foreground/70",
  },
  brand: {
    badgeVariant: "outline",
    extraBadgeClass: "border-primary/25 bg-primary/12 text-primary",
    dotClass: "bg-primary",
  },
};

const SIZE_CLASSES: Record<StatusBadgeSize, string> = {
  sm: "h-5 text-xs px-2 py-0.5 gap-1",
  md: "h-6 text-sm px-2.5 py-0.5 gap-1.5",
};

/**
 * Componente unificado para insignias de estado en el sistema.
 *
 * Utiliza tokens semánticos del tema para asegurar accesibilidad y contraste AA (≥ 4.5:1)
 * en modo claro y oscuro, sin necesidad de recurrir a colores fijos de paleta.
 *
 * @example
 * ```tsx
 * // Estado activo con punto indicador
 * <StatusBadge tone="success" dot>Activo</StatusBadge>
 *
 * // Estado de advertencia en tamaño mediano (14 px)
 * <StatusBadge tone="warning" size="md">Pendiente</StatusBadge>
 *
 * // Estado neutral / inactivo
 * <StatusBadge tone="neutral">Inactivo</StatusBadge>
 * ```
 */
export function StatusBadge({
  tone,
  children,
  dot = false,
  size = "sm",
  className,
  ...props
}: StatusBadgeProps) {
  const config = TONE_CONFIG[tone];

  return (
    <Badge
      variant={config.badgeVariant}
      className={cn(SIZE_CLASSES[size], config.extraBadgeClass, className)}
      {...props}
    >
      {dot && (
        <span
          className={cn("size-1.5 shrink-0 rounded-full", config.dotClass)}
          aria-hidden="true"
        />
      )}
      {children}
    </Badge>
  );
}
