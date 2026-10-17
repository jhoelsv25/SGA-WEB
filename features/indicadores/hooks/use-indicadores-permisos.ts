"use client";

import { useSession } from "@/features/auth";
import { MENU_INDICADORES, MENU_MIS_INDICADORES } from "../consts";

/**
 * Determina si el usuario autenticado tiene acceso al tablero general de indicadores,
 * historial de mediciones, comparación y panel directivo (Director, Subdirector o Administrador).
 */
export function usePuedeVerIndicadores(): boolean {
  const { data } = useSession();
  const roles = data?.user?.roles ?? [];
  const activeRole = data?.user?.activeRoleName ?? "";

  if (activeRole === "Administrador" || roles.includes("Administrador")) {
    return true;
  }
  return data?.user?.menuRoutes?.includes(MENU_INDICADORES) ?? false;
}

/**
 * Determina si el usuario autenticado tiene autorización para registrar pretests,
 * cerrar mediciones de bimestre y generar nuevas versiones.
 * Según la regla de negocio del RF-020, esta acción está reservada exclusivamente para
 * Director o Administrador (el Subdirector tiene permisos de solo lectura y exportación).
 */
export function usePuedeMedir(): boolean {
  const { data } = useSession();
  const roles = data?.user?.roles ?? [];
  const activeRole = data?.user?.activeRoleName ?? "";

  return (
    activeRole === "Administrador" ||
    activeRole === "Director" ||
    roles.includes("Administrador") ||
    roles.includes("Director")
  );
}

/**
 * Determina si el usuario autenticado tiene acceso a consultar sus propios indicadores
 * (docente con asignación académica en el año lectivo).
 */
export function usePuedeVerMisIndicadores(): boolean {
  const { data } = useSession();
  const roles = data?.user?.roles ?? [];
  const activeRole = data?.user?.activeRoleName ?? "";

  if (activeRole === "Administrador" || roles.includes("Administrador")) {
    return true;
  }
  return data?.user?.menuRoutes?.includes(MENU_MIS_INDICADORES) ?? false;
}
