"use client";

import { Megaphone01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { CrearComunicadoForm } from "../forms/crear-comunicado-form";

export interface ModalCrearComunicadoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grados?: Array<{ id: string; numero: number }>;
  secciones?: Array<{ id: string; nombre: string; gradoId: string }>;
}

export function ModalCrearComunicado({
  open,
  onOpenChange,
  grados = [],
  secciones = [],
}: ModalCrearComunicadoProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Redactar Comunicado Oficial"
      description="Cree un nuevo comunicado institucional. Puede guardarlo como borrador o publicarlo inmediatamente para notificar a los destinatarios."
      icon={Megaphone01Icon}
      size="lg"
    >
      {open && (
        <CrearComunicadoForm
          grados={grados}
          secciones={secciones}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
