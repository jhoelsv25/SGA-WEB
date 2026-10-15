"use client";

import * as React from "react";
import { UserCheck01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { FormularioResolverSolicitud } from "../forms/formulario-resolver-solicitud";
import type { SolicitudRevisionItem } from "../../types";

export interface ModalResolverSolicitudProps {
  solicitud: SolicitudRevisionItem | null;
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
}

export function ModalResolverSolicitud({
  solicitud,
  abierto,
  onOpenChange,
}: ModalResolverSolicitudProps) {
  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Resolver Solicitud de Revisión"
      description="Evalúe los descargos del docente para aceptar y reabrir el consolidado o rechazar la solicitud."
      icon={UserCheck01Icon}
      size="md"
    >
      {solicitud ? (
        <FormularioResolverSolicitud
          key={solicitud.id}
          solicitud={solicitud}
          onCerrar={() => onOpenChange(false)}
        />
      ) : null}
    </Modal>
  );
}
