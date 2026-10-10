import { AlertCircleIcon, Clock01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import type { TipoNotificacion } from "../types";

export interface TipoNotificacionVisualConfig {
  icon: typeof InformationCircleIcon;
  bgClass: string;
  textClass: string;
  badgeLabel: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
  colorClasses: string;
}

export const NOTIFICACION_TIPO_CONFIG: Record<TipoNotificacion, TipoNotificacionVisualConfig> = {
  informacion: {
    icon: InformationCircleIcon,
    bgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    textClass: "text-blue-600 dark:text-blue-400",
    badgeLabel: "Información",
    badgeVariant: "secondary",
    colorClasses: "text-blue-500 bg-blue-500/10",
  },
  alerta: {
    icon: AlertCircleIcon,
    bgClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900",
    textClass: "text-rose-600 dark:text-rose-400",
    badgeLabel: "Alerta",
    badgeVariant: "destructive",
    colorClasses: "text-rose-500 bg-rose-500/10",
  },
  recordatorio: {
    icon: Clock01Icon,
    bgClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    textClass: "text-amber-600 dark:text-amber-400",
    badgeLabel: "Recordatorio",
    badgeVariant: "outline",
    colorClasses: "text-amber-500 bg-amber-500/10",
  },
};

export const NOTIFICACIONES_PAGINACION_DEFAULT = {
  limitBandeja: 50,
  limitCampana: 15,
} as const;
