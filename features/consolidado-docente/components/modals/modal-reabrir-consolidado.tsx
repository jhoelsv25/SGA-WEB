"use client";

import * as React from "react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { FormularioReabrirConsolidado } from "../forms/formulario-reabrir-consolidado";
import type { ConsolidadoResumenItem } from "../../types";

export interface ModalReabrirConsolidadoProps {
  consolidado: ConsolidadoResumenItem | null;
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
}

export function ModalReabrirConsolidado({
  consolidado,
  abierto,
  onOpenChange,
}: ModalReabrirConsolidadoProps) {
  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Reapertura de Consolidado Docente"
      description="Autorice la reapertura para habilitar correcciones extemporáneas en sesiones o ausencias."
      icon={AlertCircleIcon}
      size="md"
    >
      {consolidado ? (
        <FormularioReabrirConsolidado
          key={consolidado.id}
          consolidado={consolidado}
          onCerrar={() => onOpenChange(false)}
        />
      ) : null}
    </Modal>
  );
}
