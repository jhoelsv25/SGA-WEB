import type { DecisionConsolidado, EstadoConsolidado, EstadoSolicitudRevision } from "../types";

export const ESTADOS_CONSOLIDADO_CONFIG: Record<
  EstadoConsolidado,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  }
> = {
  cerrado: {
    label: "Cerrado",
    variant: "default",
  },
  reabierto: {
    label: "Reabierto",
    variant: "outline",
    className: "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10",
  },
};

export const DECISIONES_CONSOLIDADO_CONFIG: Record<
  DecisionConsolidado,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  }
> = {
  ninguna: {
    label: "Conforme / Sin acción",
    variant: "outline",
    className: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5",
  },
  compromiso_mejora: {
    label: "Compromiso de mejora",
    variant: "outline",
    className: "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5",
  },
  llamada_atencion: {
    label: "Llamada de atención",
    variant: "destructive",
  },
  derivado: {
    label: "Derivado a UGEL",
    variant: "default",
  },
};

export const ESTADOS_SOLICITUD_CONFIG: Record<
  EstadoSolicitudRevision,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  }
> = {
  solicitada: {
    label: "Pendiente",
    variant: "secondary",
  },
  aceptada: {
    label: "Aceptada",
    variant: "outline",
    className: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  },
  rechazada: {
    label: "Rechazada",
    variant: "destructive",
  },
};

export const OPCIONES_DECISION = [
  { value: "ninguna", label: "Ninguna (Conforme / Sin acción)" },
  { value: "compromiso_mejora", label: "Compromiso de mejora pedagógica" },
  { value: "llamada_atencion", label: "Llamada de atención administrativa" },
  { value: "derivado", label: "Derivado a UGEL / Instancia superior" },
] as const;

export const OPCIONES_ACCION_SOLICITUD = [
  { value: "aceptar", label: "Aceptar solicitud (Reabrir para corrección)" },
  { value: "rechazar", label: "Rechazar solicitud" },
] as const;
