export const MATRICULA_ESTADO_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  matriculado: {
    label: "Matriculado Regular",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  retirado: {
    label: "Retirado del Colegio",
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
  },
  trasladado: {
    label: "Trasladado a Otra I.E.",
    color: "text-purple-700 dark:text-purple-300",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  culminado: {
    label: "Culminado / Promovido",
    color: "text-muted-foreground",
    bg: "bg-muted",
    border: "border-border",
  },
} as const;

export const MATRICULA_TIPO_CONFIG: Record<string, string> = {
  nuevo: "Nuevo Ingreso",
  continuador: "Estudiante Continuador",
  traslado: "Traslado Externo",
} as const;
