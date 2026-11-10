"use client";

import * as React from "react";
import {
  CalendarClockIcon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  Task01Icon,
} from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import {
  FormularioAnularCompromiso,
  FormularioCerrarCompromiso,
  FormularioRegistrarCompromiso,
  FormularioReprogramarCompromiso,
} from "../forms";
import type { CompromisoItem, ConsolidadoResumenItem } from "../../types";

interface ModalBase {
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
}

export interface ModalRegistrarCompromisoProps extends ModalBase {
  consolidado: ConsolidadoResumenItem | null;
}

export function ModalRegistrarCompromiso({
  consolidado,
  abierto,
  onOpenChange,
}: ModalRegistrarCompromisoProps) {
  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Registrar compromiso de mejora"
      description="Anote lo acordado con el docente y la fecha en que se revisará."
      icon={Task01Icon}
      size="md"
    >
      {consolidado ? (
        <FormularioRegistrarCompromiso
          key={consolidado.id}
          consolidado={consolidado}
          onCerrar={() => onOpenChange(false)}
        />
      ) : null}
    </Modal>
  );
}

export interface ModalCompromisoItemProps extends ModalBase {
  compromiso: CompromisoItem | null;
}

export function ModalCerrarCompromiso({
  compromiso,
  abierto,
  onOpenChange,
}: ModalCompromisoItemProps) {
  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Cerrar compromiso"
      description="Registre si el docente cumplió o no el compromiso."
      icon={CheckmarkCircle02Icon}
      size="md"
    >
      {compromiso ? (
        <FormularioCerrarCompromiso
          key={compromiso.id}
          compromiso={compromiso}
          onCerrar={() => onOpenChange(false)}
        />
      ) : null}
    </Modal>
  );
}

export function ModalReprogramarCompromiso({
  compromiso,
  abierto,
  onOpenChange,
}: ModalCompromisoItemProps) {
  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Reprogramar compromiso"
      description="Cambie la fecha de revisión o la descripción."
      icon={CalendarClockIcon}
      size="md"
    >
      {compromiso ? (
        <FormularioReprogramarCompromiso
          key={compromiso.id}
          compromiso={compromiso}
          onCerrar={() => onOpenChange(false)}
        />
      ) : null}
    </Modal>
  );
}

export function ModalAnularCompromiso({
  compromiso,
  abierto,
  onOpenChange,
}: ModalCompromisoItemProps) {
  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Anular compromiso"
      description="Use esta opción si se registró por error."
      icon={Delete02Icon}
      size="md"
    >
      {compromiso ? (
        <FormularioAnularCompromiso
          key={compromiso.id}
          compromiso={compromiso}
          onCerrar={() => onOpenChange(false)}
        />
      ) : null}
    </Modal>
  );
}
