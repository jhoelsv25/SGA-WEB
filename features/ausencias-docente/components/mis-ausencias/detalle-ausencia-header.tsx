import * as React from "react";
import {
  Alert02Icon,
  AlertCircleIcon,
  Calendar03Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { formatDate, formatDateTime } from "@/lib/formatters/date";
import { ETIQUETAS_MOTIVO_AUSENCIA } from "../../consts";
import type { AusenciaResponseDto } from "../../types";
import { formatearMinutos } from "../../utils";
import { EstadoAusenciaBadge } from "./estado-ausencia-badge";

interface DetalleAusenciaHeaderProps {
  ausencia: AusenciaResponseDto;
}

/**
 * Cabecera, estado, tarjeta de sesión y tramo para el modal de detalle de ausencia.
 */
export function DetalleAusenciaHeader({ ausencia }: DetalleAusenciaHeaderProps) {
  const fechaSesion = formatDate(ausencia.sesion.fecha, "dd/MM/yyyy");
  const etiquetaMotivo = ETIQUETAS_MOTIVO_AUSENCIA[ausencia.motivo] || ausencia.motivo;

  return (
    <div className="space-y-4">
      {/* Cabecera de estado e información de registro */}
      <div className="border-border/70 bg-muted/20 flex flex-wrap items-center justify-between gap-2 rounded-2xl border p-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Estado:
          </span>
          <EstadoAusenciaBadge ausencia={ausencia} />
        </div>
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
          <span>
            Registrado el {formatDateTime(ausencia.registradoEn)} por{" "}
            <strong className="text-foreground">{ausencia.registradoPor.nombreCompleto}</strong>
          </span>
        </div>
      </div>

      {/* Aviso si la ausencia se encuentra anulada */}
      {ausencia.anulada && (
        <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-2xl border p-4 text-xs">
          <div className="flex items-start gap-2.5 font-semibold">
            <HugeiconsIcon icon={AlertCircleIcon} className="size-4 shrink-0" />
            <span>Ausencia anulada por la Dirección</span>
          </div>
          {ausencia.motivoAnulacion && (
            <p className="text-foreground mt-1.5 pl-6">
              <strong>Motivo:</strong> {ausencia.motivoAnulacion}
            </p>
          )}
          {ausencia.anuladaEn && (
            <p className="text-muted-foreground mt-1 pl-6">
              Fecha de anulación: {formatDateTime(ausencia.anuladaEn)}
            </p>
          )}
        </div>
      )}

      {/* Cuadrícula de datos de la sesión y tramo */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Card Sesión */}
        <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-2xs">
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
            <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
            Sesión de clase
          </p>
          <p className="text-foreground mt-2 text-base font-bold">{ausencia.sesion.cursoNombre}</p>
          <p className="text-muted-foreground text-xs">
            Sección:{" "}
            <span className="text-foreground font-medium">{ausencia.sesion.seccionNombre}</span>
          </p>
          <p className="text-muted-foreground mt-2 text-xs">
            Fecha: <span className="text-foreground font-mono font-medium">{fechaSesion}</span>
          </p>
          <p className="text-muted-foreground text-xs">
            Horario de clase:{" "}
            <span className="text-foreground font-mono font-medium">
              {ausencia.sesion.horaInicio} – {ausencia.sesion.horaFin}
            </span>
          </p>
        </div>

        {/* Card Tramo de ausencia */}
        <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-2xs">
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
            <HugeiconsIcon icon={Alert02Icon} className="size-3.5" />
            Tramo no presencial
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-foreground font-mono text-xl font-extrabold">
              {ausencia.horaDesde} – {ausencia.horaHasta}
            </span>
            <span className="border-border/80 bg-muted/60 text-foreground rounded-full border px-2.5 py-0.5 text-xs font-bold">
              {formatearMinutos(ausencia.minutos)}
            </span>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Motivo observado:{" "}
            <span className="text-foreground font-semibold">{etiquetaMotivo}</span>
          </p>
          {ausencia.observacion && (
            <p className="bg-muted/40 text-foreground mt-1.5 rounded-xl p-2 text-xs italic">
              «{ausencia.observacion}»
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
