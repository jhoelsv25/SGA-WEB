"use client";

import * as React from "react";
import { LockIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { FormularioCerrarConsolidado } from "../forms/formulario-cerrar-consolidado";
import type { ConsolidadoResumenItem } from "../../types";

export interface ModalCerrarConsolidadoProps {
  consolidado: ConsolidadoResumenItem | null;
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
}

export function ModalCerrarConsolidado({
  consolidado,
  abierto,
  onOpenChange,
}: ModalCerrarConsolidadoProps) {
  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Cierre y Versionado de Consolidado"
      description="Bloquee las sesiones y ausencias del docente en este bimestre generando la versión final."
      icon={LockIcon}
      size="md"
    >
      {consolidado ? (
        <FormularioCerrarConsolidado
          key={consolidado.id}
          consolidado={consolidado}
          onCerrar={() => onOpenChange(false)}
        />
      ) : null}
    </Modal>
  );
}
