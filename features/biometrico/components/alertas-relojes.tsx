"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon } from "@hugeicons/core-free-icons";
import { useSession } from "@/features/auth";
import { useEstadoRelojes } from "../hooks";

const ROLES_CON_ESTADO = ["Administrador", "Soporte TI", "Secretaria"];

/**
 * Avisa si la app puente o el reloj biométrico dejaron de comunicarse (RF-022).
 * Solo se muestra a quien puede consultar el estado y no ocupa espacio si todo está en orden.
 */
export function AlertasRelojes() {
  const { data: sesion } = useSession();
  const rol = sesion?.user.activeRoleName ?? "";
  const { data: relojes } = useEstadoRelojes(ROLES_CON_ESTADO.includes(rol));

  const alertas = (relojes ?? []).flatMap((r) => r.alertas);
  if (alertas.length === 0) return null;

  return (
    <div
      role="alert"
      className="border-warning/30 bg-warning/10 flex items-start gap-3 rounded-xl border p-3.5 text-sm"
    >
      <HugeiconsIcon icon={Alert02Icon} className="text-warning mt-0.5 size-5 shrink-0" />
      <ul className="space-y-1">
        {alertas.map((alerta) => (
          <li key={alerta}>{alerta}</li>
        ))}
      </ul>
    </div>
  );
}
