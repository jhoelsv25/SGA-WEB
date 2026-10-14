"use client";

import * as React from "react";
import { FileEditIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { ResolverSolicitudForm } from "../forms/resolver-solicitud-form";
import type { SolicitudCambio } from "../../types";

interface ResolverSolicitudModalProps {
  solicitud: SolicitudCambio | null;
  accion: "aprobar" | "rechazar" | null;
  onOpenChange: (open: boolean) => void;
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
        <ResolverSolicitudForm
          key={`${solicitud.id}-${accion}`}
          solicitud={solicitud}
          accion={accion}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
