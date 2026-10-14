"use client";

import { useSession } from "@/features/auth";
import { MENU_AUSENCIAS_DOCENTES, MENU_MIS_AUSENCIAS } from "../consts";

/**
 * Determina si el usuario autenticado tiene acceso a la supervisión y gestión de ausencias
 * (Director, Subdirector, Administrador u otro rol autorizado en Roles-Menú).
 */
export function usePuedeGestionarAusencias(): boolean {
  const { data } = useSession();
  if (data?.user.activeRoleName === "Administrador") {
    return true;
  }
  return data?.user.menuRoutes?.includes(MENU_AUSENCIAS_DOCENTES) ?? false;
}

/**
 * Determina si el usuario autenticado tiene acceso a ver sus propias ausencias
 * (únicamente si cuenta con la ruta MENU_MIS_AUSENCIAS en sus menuRoutes de rol Docente).
 */
export function usePuedeVerMisAusencias(): boolean {
  const { data } = useSession();
  return data?.user.menuRoutes?.includes(MENU_MIS_AUSENCIAS) ?? false;
}
