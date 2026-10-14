"use client";

import { useSession } from "@/features/auth";
import {
  MENU_CONSOLIDADO_BIMESTRE,
  MENU_MI_SEGUIMIENTO,
  MENU_SOLICITUDES_REVISION,
} from "../consts";

/**
 * Determina si el usuario autenticado tiene acceso a la visualización del consolidado del bimestre
 * (Director, Subdirector, Administrador u otro rol autorizado en Roles-Menú).
 */
export function usePuedeVerConsolidadoBimestre(): boolean {
  const { data } = useSession();
  if (data?.user.activeRoleName === "Administrador") {
    return true;
  }
  return data?.user.menuRoutes?.includes(MENU_CONSOLIDADO_BIMESTRE) ?? false;
}

/**
 * Determina si el usuario autenticado puede realizar acciones mutacionales sobre el consolidado
 * (generar masivo/individual, registrar decisión, reabrir, volver a cerrar).
 * Subdirector cuenta con acceso al menú de consolidado pero ÚNICAMENTE para consulta.
 */
export function usePuedeGestionarConsolidado(): boolean {
  const { data } = useSession();
  const rol = data?.user.activeRoleName;
  if (rol === "Administrador") {
    return true;
  }
  // Subdirector solo consulta; no puede realizar mutaciones sobre el consolidado
  if (rol === "Subdirector") {
    return false;
  }
  return data?.user.menuRoutes?.includes(MENU_CONSOLIDADO_BIMESTRE) ?? false;
}

/**
 * Determina si el usuario autenticado puede acceder a la bandeja directiva de solicitudes de revisión
 * y resolverlas (aceptar o rechazar). Subdirector no tiene autorización para resolver solicitudes.
 */
export function usePuedeGestionarSolicitudes(): boolean {
  const { data } = useSession();
  const rol = data?.user.activeRoleName;
  if (rol === "Administrador") {
    return true;
  }
  if (rol === "Subdirector") {
    return false;
  }
  return data?.user.menuRoutes?.includes(MENU_SOLICITUDES_REVISION) ?? false;
}

/**
 * Determina si el usuario autenticado tiene acceso a consultar su propio consolidado docente
 * y presentar solicitudes de revisión (rol Docente con ruta MENU_MI_SEGUIMIENTO).
 */
export function usePuedeVerMiSeguimiento(): boolean {
  const { data } = useSession();
  return data?.user.menuRoutes?.includes(MENU_MI_SEGUIMIENTO) ?? false;
}
