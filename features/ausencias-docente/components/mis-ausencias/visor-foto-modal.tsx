"use client";

import * as React from "react";
import Image from "next/image";
import { Image01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { formatDateTime } from "@/lib/formatters/date";
import { urlDeEvidencia } from "../../api";
import type { AusenciaFotoDto } from "../../types";

interface VisorFotoModalProps {
  foto: AusenciaFotoDto | null;
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
}

/**
 * Modal para visualizar una evidencia fotográfica en tamaño completo.
 */
export function VisorFotoModal({ foto, abierto, onOpenChange }: VisorFotoModalProps) {
  if (!foto) return null;

  const urlCompleta = urlDeEvidencia(foto.archivoUrl);
  const fechaCaptura = foto.tomadaEn ? formatDateTime(foto.tomadaEn) : null;

  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Evidencia fotográfica"
      description={
        fechaCaptura
          ? `Foto registrada el ${fechaCaptura}`
          : "Evidencia visual adjunta a la ausencia"
      }
      icon={Image01Icon}
      size="2xl"
    >
      <div className="flex flex-col items-center justify-center gap-3 p-2">
        <div className="border-border/60 bg-muted/30 relative aspect-4/3 w-full overflow-hidden rounded-2xl border">
          <Image
            src={urlCompleta}
            alt="Evidencia fotográfica de la ausencia"
            fill
            unoptimized
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 700px"
          />
        </div>
        {fechaCaptura && (
          <p className="text-muted-foreground text-center text-xs">
            Capturada: <span className="text-foreground font-medium">{fechaCaptura}</span>
          </p>
        )}
      </div>
    </Modal>
  );
}
