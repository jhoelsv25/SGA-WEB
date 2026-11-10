import type { StatusBadgeTone } from "@/components/common/status-badge";
import type { UserStatus } from "../types/users.types";

export interface UserStatusConfig {
  label: string;
  tone: StatusBadgeTone;
}

export const USER_STATUS_CONFIG: Record<UserStatus, UserStatusConfig> = {
  activo: {
    label: "Activo",
    tone: "success",
  },
  bloqueado: {
    label: "Bloqueado",
    tone: "warning",
  },
  inactivo: {
    label: "Inactivo",
    tone: "neutral",
  },
};

/** RF-002 V4: roles que solo puede tener quien tiene la ficha vigente de ese tipo. */
export const ROLES_CON_FICHA: readonly string[] = ["Docente", "Estudiante", "Apoderado"];

/** RF-002: cargos que requieren ficha y por eso no se ofrecen en "Usuarios". */
export const CARGOS_CON_FICHA: readonly string[] = [
  "Estudiante",
  "Docente de aula",
  "Apoderado(a)",
];
