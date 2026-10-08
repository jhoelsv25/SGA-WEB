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
    className:
      "bg-primary/10 text-primary border-primary/20 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
  },
  custom: {
    label: "Adicional",
    className:
      "bg-muted text-muted-foreground border-border rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
  },
} as const;
