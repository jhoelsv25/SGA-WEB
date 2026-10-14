"use client";

import * as React from "react";
import { AlertCircleIcon, Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MENSAJES_CONSOLIDADO } from "../../consts";
import { useAceptarSolicitudRevision, useRechazarSolicitudRevision } from "../../hooks";
import type { SolicitudRevisionResponseDto } from "../../types";

export interface FormularioResolverSolicitudProps {
  solicitud: SolicitudRevisionResponseDto;
  accion: "aceptar" | "rechazar";
  onCancel: () => void;
  onSuccess: () => void;
}

/**
 * Formulario para resolver una solicitud de revisión de consolidado directiva.
 * - En aceptación: la respuesta es opcional y reabre automáticamente el consolidado.
 * - En rechazo: la respuesta es estrictamente obligatoria con el mensaje canónico:
 *   «Indique la respuesta para el docente.»
 */
export function FormularioResolverSolicitud({
  solicitud,
  accion,
  onCancel,
  onSuccess,
}: FormularioResolverSolicitudProps) {
  const [respuesta, setRespuesta] = React.useState("");
  const [errorRespuesta, setErrorRespuesta] = React.useState<string | null>(null);
  const [confirmado, setConfirmado] = React.useState(false);

  const aceptarMutation = useAceptarSolicitudRevision();
  const rechazarMutation = useRechazarSolicitudRevision();

  const isPending = aceptarMutation.isPending || rechazarMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (accion === "rechazar") {
      const texto = respuesta.trim();
      if (!texto) {
        setErrorRespuesta(MENSAJES_CONSOLIDADO.SOLICITUD_RECHAZADA_SIN_RESPUESTA);
        return;
      }
    }

    if (!confirmado) {
      setConfirmado(true);
      return;
    }

    if (accion === "aceptar") {
      aceptarMutation.mutate(
        {
          id: solicitud.id,
          dto: respuesta.trim() ? { respuesta: respuesta.trim() } : undefined,
        },
        {
          onSuccess: () => {
            onSuccess();
          },
        },
      );
    } else {
      rechazarMutation.mutate(
        {
          id: solicitud.id,
          dto: { respuesta: respuesta.trim() },
        },
        {
          onSuccess: () => {
            onSuccess();
          },
        },
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Resumen del contexto de la solicitud */}
      <div className="border-border/60 bg-muted/30 space-y-2 rounded-xl border p-3.5 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <p className="text-foreground font-bold">{solicitud.docenteNombre}</p>
          <span className="text-muted-foreground font-mono">DNI: {solicitud.docenteDocumento}</span>
        </div>
        <p className="text-muted-foreground">
          Bimestre: <span className="text-foreground font-medium">{solicitud.periodoNombre}</span>
        </p>
        <div className="border-border/40 bg-background/80 rounded-lg border p-2.5">
          <p className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase">
            Motivo expuesto por el docente:
          </p>
          <p className="text-foreground mt-1 leading-relaxed whitespace-pre-wrap">
            «{solicitud.motivo}»
          </p>
        </div>
      </div>

      {/* Explicación de la acción y confirmación previa */}
      {accion === "aceptar" ? (
        <div className="border-primary/25 bg-primary/8 text-primary flex items-start gap-2.5 rounded-lg border p-3 text-xs leading-relaxed">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="mt-0.5 size-4.5 shrink-0" />
          <div>
            <p className="font-semibold">Confirmación de aceptación y reapertura</p>
            <p className="text-foreground/80 mt-0.5">
              Al aceptar esta solicitud, el consolidado vigente pasará a estado{" "}
              <strong>Reabierto</strong>. Esto permitirá registrar o anular ausencias y corregir
              sesiones de clase de este bimestre.
            </p>
          </div>
        </div>
      ) : (
        <div className="border-destructive/25 bg-destructive/8 text-destructive flex items-start gap-2.5 rounded-lg border p-3 text-xs leading-relaxed">
          <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 size-4.5 shrink-0" />
          <div>
            <p className="font-semibold">Confirmación de rechazo directivo</p>
            <p className="text-foreground/80 mt-0.5">
              Al rechazar la solicitud, el consolidado permanecerá cerrado y se notificará al
              docente con la fundamentación obligatoria ingresada.
            </p>
          </div>
        </div>
      )}

      {/* Campo de respuesta directiva */}
      <div className="space-y-1.5">
        <Label htmlFor="respuesta-docente" className="text-sm font-medium">
          {accion === "rechazar" ? (
            <>
              Respuesta para el docente <span className="text-destructive">*</span>
            </>
          ) : (
            <>
              Respuesta o indicación{" "}
              <span className="text-muted-foreground text-xs">(Opcional)</span>
            </>
          )}
        </Label>
        <Textarea
          id="respuesta-docente"
          value={respuesta}
          onChange={(e) => {
            setRespuesta(e.target.value);
            if (errorRespuesta) setErrorRespuesta(null);
          }}
          placeholder={
            accion === "rechazar"
              ? "Indique la fundamentación o motivo del rechazo para el docente..."
              : "Ingrese una indicación o respuesta para el docente (opcional)..."
          }
          maxLength={1000}
          rows={3}
          disabled={isPending}
          aria-invalid={Boolean(errorRespuesta)}
          className="resize-none text-xs"
        />
        <div className="flex items-center justify-between">
          {errorRespuesta ? (
            <p className="text-destructive text-xs font-medium">{errorRespuesta}</p>
          ) : (
            <p className="text-muted-foreground text-2xs">
              {accion === "rechazar"
                ? "Obligatorio. Se enviará en la notificación oficial al docente."
                : "Se notificará al docente junto con la confirmación de reapertura."}
            </p>
          )}
          <span className="text-muted-foreground text-2xs font-mono">{respuesta.length}/1000</span>
        </div>
      </div>

      {/* Pregunta de confirmación si ya se pasó el primer paso */}
      {confirmado && (
        <div className="border-warning/35 bg-warning/10 text-warning-text animate-in fade-in-50 rounded-lg border p-3 text-xs">
          <p className="font-semibold">¿Está totalmente seguro de proceder?</p>
          <p className="text-foreground/80 text-2xs mt-0.5">
            {accion === "aceptar"
              ? "El consolidado quedará reabierto de inmediato."
              : "La solicitud quedará registrada como rechazada de forma definitiva."}
          </p>
        </div>
      )}

      {/* Botones de acción del pie */}
      <div className="flex justify-end gap-2.5 border-t pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
          className="h-9 gap-1.5 px-4 text-xs font-semibold"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cancelar</span>
        </Button>

        <Button
          type="submit"
          variant={accion === "rechazar" ? "destructive" : "default"}
          disabled={isPending}
          className="h-9 gap-1.5 px-4.5 text-xs font-semibold shadow-xs"
        >
          {isPending ? (
            <Spinner className="size-3.5" />
          ) : accion === "rechazar" ? (
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>
            {confirmado
              ? accion === "aceptar"
                ? "Sí, aceptar y reabrir"
                : "Sí, confirmar rechazo"
              : accion === "aceptar"
                ? "Aceptar solicitud"
                : "Rechazar solicitud"}
          </span>
        </Button>
      </div>
    </form>
  );
}
