"use client";

import * as React from "react";
import { ShieldAlertIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { TIPO_MODERACION_CONFIG } from "../../consts";
import { OcultarContenidoForm, type OcultarContenidoTarget } from "../forms/ocultar-contenido-form";

export type { OcultarContenidoTarget };

interface OcultarContenidoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: OcultarContenidoTarget | null;
  cursoSeccionId: string;
}

export function OcultarContenidoModal({
  open,
  onOpenChange,
  target,
  cursoSeccionId,
}: OcultarContenidoModalProps) {
  const tipoLabel = target ? TIPO_MODERACION_CONFIG[target.tipo].singular : "el contenido";

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Ocultar contenido por moderación"
      description={`Está a punto de ocultar ${tipoLabel} para los estudiantes. Quedará registrado en el historial de moderación con su motivo.`}
      icon={ShieldAlertIcon}
      size="md"
    >
      {target && (
        <OcultarContenidoForm
          key={`${target.tipo}-${target.id}`}
          target={target}
          cursoSeccionId={cursoSeccionId}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
