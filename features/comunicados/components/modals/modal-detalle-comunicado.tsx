"use client";

import { Megaphone01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { formatDate } from "@/lib/formatters/date";
import { ComunicadoDetalleView } from "../cards/comunicado-detalle-view";
import type { ComunicadoItem } from "../../types";

export interface ModalDetalleComunicadoProps {
  comunicado: ComunicadoItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "contenido" | "lecturas";
  currentUserId?: string;
}

export function ModalDetalleComunicado({
  comunicado,
  open,
  onOpenChange,
  defaultTab = "contenido",
  currentUserId,
}: ModalDetalleComunicadoProps) {
  if (!comunicado) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={comunicado.titulo}
      description={
        comunicado.publicadoEn
          ? `Publicado: ${formatDate(comunicado.publicadoEn, "dd MMM yyyy")}`
          : "Borrador de comunicado oficial"
      }
      icon={Megaphone01Icon}
      size="xl"
    >
      <ComunicadoDetalleView
        key={`${comunicado.id}-${defaultTab}`}
        comunicado={comunicado}
        defaultTab={defaultTab}
        currentUserId={currentUserId}
      />
    </Modal>
  );
}
