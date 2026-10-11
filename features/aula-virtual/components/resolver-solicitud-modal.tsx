"use client";

import * as React from "react";
import { FileEditIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useResolverSolicitud } from "../hooks";
import type { SolicitudCambio } from "../types";

interface ResolverSolicitudModalProps {
  solicitud: SolicitudCambio | null;
  accion: "aprobar" | "rechazar" | null;
  onOpenChange: (open: boolean) => void;
}

function FormularioResolver({
  solicitud,
  accion,
  onCerrar,
}: {
  solicitud: SolicitudCambio;
  accion: "aprobar" | "rechazar";
  onCerrar: () => void;
}) {
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
      { onSuccess: onCerrar },
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
          maxLength={500}
          disabled={resolver.isPending}
        />
      </div>
      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant={accion === "rechazar" ? "destructive" : "default"}
          disabled={resolver.isPending}
          className="min-h-10 gap-2"
        >
          {resolver.isPending && <Spinner className="size-4" />}
          {accion === "aprobar" ? "Aprobar" : "Rechazar"}
        </Button>
      </div>
    </form>
  );
}

export function ResolverSolicitudModal({
  solicitud,
  accion,
  onOpenChange,
}: ResolverSolicitudModalProps) {
  return (
    <Modal
      open={Boolean(solicitud && accion)}
      onOpenChange={onOpenChange}
      title={accion === "aprobar" ? "Aprobar cambio de fecha" : "Rechazar cambio de fecha"}
      description={
        solicitud
          ? `${solicitud.materialTitulo} · ${solicitud.fechaAnterior.slice(0, 10)} → ${solicitud.fechaSolicitada.slice(0, 10)}`
          : undefined
      }
      icon={FileEditIcon}
      size="md"
    >
      {solicitud && accion && (
        <FormularioResolver
          key={`${solicitud.id}-${accion}`}
          solicitud={solicitud}
          accion={accion}
          onCerrar={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
