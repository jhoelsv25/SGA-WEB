import type { UserStatus } from "../types/users.types";

export const USER_STATUS_CONFIG: Record<
  UserStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
    dotClass: string;
  }
> = {
  activo: {
    label: "Activo",
    variant: "outline",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1.5 rounded-full px-2.5 py-0.5",
    dotClass: "bg-emerald-500 animate-pulse",
  },
  bloqueado: {
    label: "Bloqueado",
    variant: "outline",
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1.5 rounded-full px-2.5 py-0.5",
    dotClass: "bg-amber-500",
  },
  inactivo: {
    label: "Inactivo",
    variant: "outline",
    className: "border-muted bg-muted/60 text-muted-foreground gap-1.5 rounded-full px-2.5 py-0.5",
    dotClass: "bg-muted-foreground/60",
  },
};
