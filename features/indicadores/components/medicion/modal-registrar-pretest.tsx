"use client";

import * as React from "react";
import { Modal } from "@/components/common/modal";
import { DocumentValidationIcon } from "@hugeicons/core-free-icons";
import { FormRegistrarPretest } from "./form-registrar-pretest";
import { useRegistrarPretestMutation } from "../../hooks/use-indicadores-mutations";
import type { Indicador, RegistrarPretestDto } from "../../types";

export interface ModalRegistrarPretestProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  indicadorInicial?: Indicador;
  onExito?: () => void;
}

export function ModalRegistrarPretest({
  open,
  onOpenChange,
  indicadorInicial = "CSP",
  onExito,
}: ModalRegistrarPretestProps) {
  const registrarMutation = useRegistrarPretestMutation();

  const manejarEnvio = async (dto: RegistrarPretestDto) => {
    await registrarMutation.mutateAsync(dto, {
      onSuccess: () => {
        onOpenChange(false);
        onExito?.();
      },
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Registrar pretest de indicador"
      description="Ingresa la medición histórica previa a la implementación del sistema (línea base de la tesis)."
      icon={DocumentValidationIcon}
      size="lg"
    >
      <FormRegistrarPretest
        indicadorInicial={indicadorInicial}
        onSubmit={manejarEnvio}
        isLoading={registrarMutation.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
