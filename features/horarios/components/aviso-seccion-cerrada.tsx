import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";

export function AvisoSeccionCerrada() {
  return (
    <div className="border-border bg-muted/50 text-muted-foreground flex items-center gap-3 rounded-xl border p-3.5 text-xs sm:text-sm">
      <HugeiconsIcon icon={InformationCircleIcon} className="text-primary size-5 shrink-0" />
      <p>
        <strong className="text-foreground font-semibold">Modo de solo consulta:</strong> La sección
        está cerrada y no admite cambios en su horario.
      </p>
    </div>
  );
}
