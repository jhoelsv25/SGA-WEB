"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/common/spinner";
import { useResolverSolicitud } from "../../hooks";
import type { SolicitudCambio } from "../../types";

interface ResolverSolicitudFormProps {
  solicitud: SolicitudCambio;
  accion: "aprobar" | "rechazar";
  onCancel: () => void;
  onSuccess?: () => void;
}

export function ResolverSolicitudForm({
  solicitud,
  accion,
  onCancel,
  onSuccess,
}: ResolverSolicitudFormProps) {
  const [respuesta, setRespuesta] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const resolver = useResolverSolicitud();

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (accion === "rechazar" && !respuesta.trim()) {
      setError("Indique la respuesta para el docente.");
      return;
    }
    resolver.mutate(
      { id: solicitud.id, accion, respuesta: respuesta.trim() || undefined },
      { onSuccess },
    );
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <p className="text-muted-foreground text-sm">
        Motivo del docente: <span className="text-foreground">{solicitud.motivo}</span>
      </p>
      <div className="space-y-1.5">
        <Label htmlFor="solicitud-respuesta" className="text-sm font-medium">
          Respuesta {accion === "rechazar" ? "*" : "(opcional)"}
        </Label>
        <Textarea
          id="solicitud-respuesta"
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          placeholder="Indique la justificación o respuesta para el docente..."
          maxLength={500}
          disabled={resolver.isPending}
        />
      </div>
      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10 gap-2" onClick={onCancel}>
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
          <span>Cancelar</span>
        </Button>
        <Button
          type="submit"
          variant={accion === "rechazar" ? "destructive" : "default"}
          disabled={resolver.isPending}
          className="min-h-10 gap-2"
        >
          {resolver.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <HugeiconsIcon
              icon={accion === "rechazar" ? Delete02Icon : CheckmarkCircle02Icon}
              size={16}
            />
          )}
          <span>{accion === "aprobar" ? "Aprobar solicitud" : "Rechazar solicitud"}</span>
        </Button>
      </div>
    </form>
  );
}
