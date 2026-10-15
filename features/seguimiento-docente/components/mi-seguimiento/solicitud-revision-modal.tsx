"use client";

import * as React from "react";
import { FileEditIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { useCrearSolicitudRevision } from "../../hooks";
import { SolicitudRevisionForm } from "./solicitud-revision-form";
import type { SolicitudRevisionFormValues } from "./solicitud-revision.schema";

interface SolicitudRevisionModalProps {
  consolidadoId: string;
  periodoNombre: string;
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
  onSolicitudEnviada?: () => void;
}

/**
 * Modal contenedor para presentar una solicitud de revisión de consolidado (HU3).
 */
export function SolicitudRevisionModal({
  consolidadoId,
  periodoNombre,
  abierto,
  onOpenChange,
  onSolicitudEnviada,
}: SolicitudRevisionModalProps) {
  const mutation = useCrearSolicitudRevision();

  const handleEnviar = (valores: SolicitudRevisionFormValues, adjunto?: File) => {
    mutation.mutate(
      {
        datos: {
          consolidadoId,
          motivo: valores.motivo,
        },
        adjunto,
      },
      {
        onSuccess: () => {
          onSolicitudEnviada?.();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Solicitar revisión de consolidado"
      description={`Bimestre: ${periodoNombre} · Presentación de solicitud de revisión`}
      icon={FileEditIcon}
      size="lg"
    >
      <div className="py-1">
        <SolicitudRevisionForm
          cargando={mutation.isPending}
          onSubmit={handleEnviar}
          onCancel={() => onOpenChange(false)}
        />
      </div>
    </Modal>
  );
}
