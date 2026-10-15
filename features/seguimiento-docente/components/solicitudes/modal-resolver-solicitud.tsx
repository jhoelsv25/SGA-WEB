"use client";

import * as React from "react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { FormularioResolverSolicitud } from "./formulario-resolver-solicitud";
import type { SolicitudRevisionResponseDto } from "../../types";

export interface ModalResolverSolicitudProps {
  solicitud: SolicitudRevisionResponseDto | null;
  accion: "aceptar" | "rechazar" | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

/**
 * Modal para que el Director resuelva una solicitud de revisión:
 * - Aceptar (con reapertura automática del consolidado).
 * - Rechazar (con respuesta obligatoria para el docente).
 */
export function ModalResolverSolicitud({
  solicitud,
  accion,
  open,
  onOpenChange,
  onSuccess,
}: ModalResolverSolicitudProps) {
  if (!solicitud || !accion) return null;

  const esAceptar = accion === "aceptar";

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={esAceptar ? "Aceptar solicitud de revisión" : "Rechazar solicitud de revisión"}
      description={
        esAceptar
          ? `Se reabrirá el consolidado de ${solicitud.docenteNombre} (${solicitud.periodoNombre}).`
          : `Se notificará a ${solicitud.docenteNombre} el rechazo de su solicitud.`
      }
      icon={esAceptar ? CheckmarkCircle02Icon : Cancel01Icon}
      size="lg"
    >
      <FormularioResolverSolicitud
        key={`${solicitud.id}-${accion}`}
        solicitud={solicitud}
        accion={accion}
        onCancel={() => onOpenChange(false)}
        onSuccess={() => {
          onOpenChange(false);
          onSuccess?.();
        }}
      />
    </Modal>
  );
}
