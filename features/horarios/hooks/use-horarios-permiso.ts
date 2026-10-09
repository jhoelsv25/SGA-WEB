"use client";

import { useSession } from "@/features/auth";

const MENU_HORARIOS = "/admin/horarios";

/**
 * Hook para determinar si el usuario en sesión tiene permisos de gestión sobre horarios.
 * Administrador siempre puede; los demás roles requieren tener la ruta `/admin/horarios` en sus menúes asignados.
 */
export function usePuedeGestionarHorarios(): boolean {
  const { data } = useSession();
  const rol = (data?.user.activeRoleName ?? data?.user.roles?.[0] ?? "").toLowerCase();
  if (rol.includes("admin")) return true;
  return data?.user.menuRoutes?.includes(MENU_HORARIOS) ?? false;
}
