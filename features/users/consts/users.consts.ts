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
