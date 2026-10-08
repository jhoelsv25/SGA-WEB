import type { UserStatus } from "../types/users.types";

export const USER_STATUS_CONFIG: Record<
  UserStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
  }
> = {
  activo: {
    label: "Activo",
    variant: "outline",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  bloqueado: {
    label: "Bloqueado",
    variant: "outline",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  inactivo: {
    label: "Inactivo",
    variant: "outline",
    className: "border-muted bg-muted text-muted-foreground",
  },
};
