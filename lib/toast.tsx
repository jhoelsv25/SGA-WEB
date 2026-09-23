"use client";

import React from "react";
import { toast as sonnerToast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { IconSvgElement } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Alert02Icon,
  InformationCircleIcon,
  Loading03Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

export interface CustomCardToastOptions {
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info" | "loading" | "default";
  icon?: IconSvgElement;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick?: () => void;
  };
  duration?: number;
}

const TYPE_CONFIG = {
  success: {
    icon: CheckmarkCircle02Icon,
    badge:
      "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 ring-4 ring-emerald-500/5 dark:bg-emerald-500/20 dark:text-emerald-400",
    title: "text-emerald-700 dark:text-emerald-300",
    description: "text-emerald-800/80 dark:text-emerald-200/80",
    accentBorder: "border-l-4 border-l-emerald-500",
    spinIcon: false,
  },
  error: {
    icon: AlertCircleIcon,
    badge:
      "border border-destructive/20 bg-destructive/10 text-destructive ring-4 ring-destructive/5 dark:bg-destructive/20 dark:text-red-400",
    title: "text-destructive dark:text-red-400",
    description: "text-destructive/80 dark:text-red-300/80",
    accentBorder: "border-l-4 border-l-destructive",
    spinIcon: false,
  },
  warning: {
    icon: Alert02Icon,
    badge:
      "border border-amber-500/20 bg-amber-500/10 text-amber-600 ring-4 ring-amber-500/5 dark:bg-amber-500/20 dark:text-amber-400",
    title: "text-amber-700 dark:text-amber-300",
    description: "text-amber-800/80 dark:text-amber-200/80",
    accentBorder: "border-l-4 border-l-amber-500",
    spinIcon: false,
  },
  info: {
    icon: InformationCircleIcon,
    badge:
      "border border-primary/20 bg-primary/10 text-primary ring-4 ring-primary/5 dark:bg-primary/20 dark:text-blue-400",
    title: "text-primary dark:text-blue-400",
    description: "text-primary/80 dark:text-blue-300/80",
    accentBorder: "border-l-4 border-l-primary",
    spinIcon: false,
  },
  loading: {
    icon: Loading03Icon,
    badge:
      "border border-primary/20 bg-primary/10 text-primary ring-4 ring-primary/5 dark:bg-primary/20 dark:text-primary",
    title: "text-foreground",
    description: "text-muted-foreground",
    accentBorder: "border-l-4 border-l-primary",
    spinIcon: true,
  },
  default: {
    icon: InformationCircleIcon,
    badge: "border border-border bg-muted text-foreground ring-4 ring-muted/20",
    title: "text-foreground",
    description: "text-muted-foreground",
    accentBorder: "",
    spinIcon: false,
  },
};

/**
 * Muestra un Toast tipo Card moderno, con adaptación a tema claro/oscuro nativo
 * y paleta armoniosa con el diseño del sistema.
 */
export function showCardToast(options: CustomCardToastOptions): string | number {
  const { title, description, type = "default", icon, action, cancel, duration = 5000 } = options;

  const config = TYPE_CONFIG[type];
  const IconComponent = icon || config.icon;

  return sonnerToast.custom(
    (id) => (
      <div
        data-toast-card
        className={`bg-card/95 border-border/80 text-foreground flex w-full items-start gap-4 rounded-2xl border p-4 shadow-xl shadow-black/20 backdrop-blur-md transition-all ${config.accentBorder}`}
      >
        {/* Ícono estilizado */}
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform ${config.badge}`}
        >
          <HugeiconsIcon
            icon={IconComponent}
            size={22}
            strokeWidth={2.2}
            className={config.spinIcon ? "animate-spin" : ""}
          />
        </div>

        {/* Contenido (Título, Descripción, Acciones) */}
        <div className="flex flex-1 flex-col gap-1 pr-2">
          <p className={`text-sm leading-tight font-bold ${config.title}`}>{title}</p>
          {description && (
            <p className={`text-xs leading-relaxed ${config.description}`}>{description}</p>
          )}

          {/* Botones de acción */}
          {(action || cancel) && (
            <div className="mt-2.5 flex items-center gap-2">
              {action && (
                <button
                  type="button"
                  onClick={() => {
                    action.onClick();
                    sonnerToast.dismiss(id);
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex cursor-pointer items-center justify-center rounded-xl px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors"
                >
                  {action.label}
                </button>
              )}
              {cancel && (
                <button
                  type="button"
                  onClick={() => {
                    cancel.onClick?.();
                    sonnerToast.dismiss(id);
                  }}
                  className="bg-muted text-muted-foreground hover:bg-muted/80 inline-flex cursor-pointer items-center justify-center rounded-xl px-3 py-1.5 text-xs font-medium transition-colors"
                >
                  {cancel.label}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Botón cerrar */}
        <button
          type="button"
          onClick={() => sonnerToast.dismiss(id)}
          className="text-muted-foreground hover:text-foreground hover:bg-muted/80 cursor-pointer rounded-lg p-1 transition-colors"
          aria-label="Cerrar notificación"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
        </button>
      </div>
    ),
    {
      duration,
      unstyled: true,
      className: "w-full",
    },
  );
}

// Re-exportar el toast estándar junto a métodos rápidos de tarjeta
export const toast = Object.assign(sonnerToast, {
  card: showCardToast,
  cardLoading: (title: string, description?: string, extra?: Partial<CustomCardToastOptions>) =>
    showCardToast({
      title,
      description,
      type: "loading",
      duration: 120000,
      ...extra,
    }),
  cardSuccess: (title: string, description?: string, extra?: Partial<CustomCardToastOptions>) =>
    showCardToast({ title, description, type: "success", ...extra }),
  cardError: (title: string, description?: string, extra?: Partial<CustomCardToastOptions>) =>
    showCardToast({ title, description, type: "error", ...extra }),
  cardWarning: (title: string, description?: string, extra?: Partial<CustomCardToastOptions>) =>
    showCardToast({ title, description, type: "warning", ...extra }),
  cardInfo: (title: string, description?: string, extra?: Partial<CustomCardToastOptions>) =>
    showCardToast({ title, description, type: "info", ...extra }),
});
