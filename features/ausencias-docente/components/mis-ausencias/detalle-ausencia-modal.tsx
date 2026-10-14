"use client";

import * as React from "react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import type { AusenciaFotoDto, AusenciaResponseDto } from "../../types";
import { DetalleAusenciaDescargo } from "./detalle-ausencia-descargo";
import { DetalleAusenciaFotos } from "./detalle-ausencia-fotos";
import { DetalleAusenciaHeader } from "./detalle-ausencia-header";

interface DetalleAusenciaModalProps {
  ausencia: AusenciaResponseDto | null;
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
  onAbrirDescargo: (ausencia: AusenciaResponseDto) => void;
  onVerFoto: (foto: AusenciaFotoDto) => void;
}

/**
 * Modal modular que presenta el detalle integral de una ausencia vigente para el docente (HU3).
 */
export function DetalleAusenciaModal({
  ausencia,
  abierto,
  onOpenChange,
  onAbrirDescargo,
  onVerFoto,
}: DetalleAusenciaModalProps) {
  if (!ausencia) return null;

  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Detalle de ausencia"
      description={`${ausencia.sesion.cursoNombre} · ${ausencia.sesion.seccionNombre}`}
      icon={InformationCircleIcon}
      size="xl"
    >
      <div className="space-y-4 py-2">
        {/* Cabecera de estado, tarjeta de sesión y tramo ausente */}
        <DetalleAusenciaHeader ausencia={ausencia} />

        {/* Galería de evidencias fotográficas adjuntas */}
        <DetalleAusenciaFotos fotos={ausencia.fotos} onVerFoto={onVerFoto} />

        {/* Sección de estado y acción de descargo docente */}
        <DetalleAusenciaDescargo
          ausencia={ausencia}
          onAbrirDescargo={onAbrirDescargo}
          onCerrarDetalle={() => onOpenChange(false)}
        />

        {/* Botón de cierre con área táctil cómoda */}
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 min-h-10 rounded-full px-5 text-xs font-semibold"
          >
            Cerrar detalle
          </Button>
        </div>
      </div>
    </Modal>
  );
}
