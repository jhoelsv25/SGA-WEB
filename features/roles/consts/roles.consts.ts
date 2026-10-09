export const SYSTEM_ROLE_NAMES = [
  "Administrador",
  "Director",
  "Subdirector",
  "Soporte TI",
  "Secretaria",
  "Docente",
  "Estudiante",
  "Apoderado",
] as const;

export const ROLE_BADGE_VARIANTS = {
  system: {
    label: "Sistema",
    tone: "brand" as const,
    className:
      "bg-primary/10 text-primary border-primary/20 rounded-full px-2.5 py-0.5 text-xs font-semibold",
  },
  custom: {
    label: "Adicional",
    tone: "neutral" as const,
    className:
      "bg-muted text-muted-foreground border-border rounded-full px-2.5 py-0.5 text-xs font-semibold",
  },
} as const;
