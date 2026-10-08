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
    className: "bg-primary/10 text-primary border-primary/20",
  },
  custom: {
    label: "Adicional",
    className: "bg-muted text-muted-foreground border-border",
  },
} as const;
