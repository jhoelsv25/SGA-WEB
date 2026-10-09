"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useLogout } from "../hooks/use-auth";

/**
 * Sale del cambio de contraseña obligatorio cerrando la sesión. Volver al login sin
 * cerrarla redirige otra vez aquí.
 */
export function CerrarSesionEnlace() {
  const { mutate: cerrarSesion, isPending } = useLogout();

  return (
    <button
      type="button"
      onClick={() => cerrarSesion()}
      disabled={isPending}
      className="text-muted-foreground hover:text-primary focus-visible:ring-ring/40 inline-flex min-h-11 items-center gap-1.5 rounded-full text-xs font-semibold transition-colors outline-none focus-visible:ring-2 disabled:opacity-50"
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
      <span>{isPending ? "Cerrando sesión..." : "Cerrar sesión"}</span>
    </button>
  );
}
