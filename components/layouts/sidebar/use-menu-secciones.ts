"use client";

import * as React from "react";
import { menuDelUsuario } from "@/config";
import { useSession } from "@/features/auth";

/** Secciones del menú que corresponden al rol activo. */
export function useMenuSecciones() {
  const { data: session } = useSession();
  const rolActivo = session?.user.activeRoleName ?? session?.user.roles?.[0] ?? "";
  const menuRoutes = session?.user.menuRoutes;

  return React.useMemo(
    () => menuDelUsuario({ esAdministrador: rolActivo === "Administrador", menuRoutes }),
    [rolActivo, menuRoutes],
  );
}
