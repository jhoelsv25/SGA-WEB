"use client";

import * as React from "react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { FormularioDecisionDirector } from "../forms/formulario-decision-director";
import type { ConsolidadoResumenItem } from "../../types";

export interface ModalDecisionDirectorProps {
  consolidado: ConsolidadoResumenItem | null;
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
}

export function ModalDecisionDirector({
  consolidado,
  abierto,
  onOpenChange,
}: ModalDecisionDirectorProps) {
  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Decisión del Director / Supervisor"
      description="Registre la evaluación pedagógica o administrativa para el consolidado bimestral."
      icon={CheckmarkCircle02Icon}
      size="md"
    >
      {consolidado ? (
        <FormularioDecisionDirector
          key={consolidado.id}
          consolidado={consolidado}
          onCerrar={() => onOpenChange(false)}
        />
      ) : null}
    </Modal>
  );
}
