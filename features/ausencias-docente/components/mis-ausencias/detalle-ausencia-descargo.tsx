import * as React from "react";
import { AlertCircleIcon, CheckmarkCircle02Icon, FileEditIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/formatters/date";
import { MENSAJES_AUSENCIA } from "../../consts";
import type { AusenciaResponseDto } from "../../types";
import { esDescargoPermitido, formatearFechaLimite } from "../../utils";

interface DetalleAusenciaDescargoProps {
  ausencia: AusenciaResponseDto;
  onAbrirDescargo: (ausencia: AusenciaResponseDto) => void;
  onCerrarDetalle: () => void;
}

/**
 * Sección de visualización o acción de descargo docente para el modal de detalle.
 */
export function DetalleAusenciaDescargo({
  ausencia,
  onAbrirDescargo,
  onCerrarDetalle,
}: DetalleAusenciaDescargoProps) {
  const fechaLimite =
    ausencia.fechaLimiteDescargoFormateada ?? formatearFechaLimite(ausencia.fechaLimiteDescargo);
  const puedeDescargar = esDescargoPermitido(ausencia);

  return (
    <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
          <HugeiconsIcon icon={FileEditIcon} className="size-3.5" />
          Descargo del docente (HU3)
        </p>
        {fechaLimite !== "-" && (
          <span className="text-muted-foreground text-xs">
            Plazo límite: <strong className="text-foreground">{fechaLimite}</strong>
          </span>
        )}
      </div>

      {ausencia.descargo !== null ? (
        <div className="mt-3 space-y-2">
          <div className="text-success-text flex items-center gap-2 text-xs font-semibold">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
            <span>Descargo presentado el {formatDateTime(ausencia.descargoEn)}</span>
          </div>
          <div className="border-border/70 bg-muted/20 text-foreground rounded-xl border p-3 text-xs leading-relaxed whitespace-pre-wrap">
            {ausencia.descargo}
          </div>
        </div>
      ) : ausencia.anulada ? (
        <p className="text-muted-foreground mt-3 text-xs">
          Esta ausencia se encuentra anulada. No requiere presentación de descargo.
        </p>
      ) : puedeDescargar ? (
        <div className="border-warning/30 bg-warning/10 mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 text-xs">
          <p className="text-warning-text">
            Usted aún no ha presentado su descargo para esta ausencia. Tiene plazo hasta el{" "}
            <strong>{fechaLimite}</strong>.
          </p>
          <Button
            type="button"
            onClick={() => {
              onCerrarDetalle();
              onAbrirDescargo(ausencia);
            }}
            className="h-10 min-h-10 gap-1.5 rounded-full px-4 text-xs font-semibold"
          >
            <HugeiconsIcon icon={FileEditIcon} className="size-3.5" />
            <span>Presentar descargo</span>
          </Button>
        </div>
      ) : (
        <div className="border-destructive/20 bg-destructive/10 text-destructive mt-3 flex items-start gap-2.5 rounded-xl border p-3 text-xs">
          <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-semibold">Plazo vencido</p>
            <p className="mt-0.5">{MENSAJES_AUSENCIA.DESCARGO_FUERA_DE_PLAZO(fechaLimite)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
