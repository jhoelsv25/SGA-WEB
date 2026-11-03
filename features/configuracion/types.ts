import { Settings02Icon } from "@hugeicons/core-free-icons";

export type TabConfiguracion =
  "institucion" | "variables" | "turnos" | "equipos" | "biometrico" | "seguridad" | "notificaciones";

export interface ItemMenuConfig {
  id: TabConfiguracion;
  label: string;
  descripcion: string;
  icono: typeof Settings02Icon;
  grupo: "general" | "politicas";
}
