"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { useCreateBloqueMutation, useUpdateBloqueMutation } from "../../hooks";
import type { BloqueHorario, CargaItemHorario } from "../../types";
import { BloqueForm } from "../forms/bloque-form";
import type { BloqueFormValues } from "../../schemas";

interface BloqueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seccionId: string;
  bloque?: BloqueHorario | null;
  diaSemanaInicial?: number;
  horaInicioInicial?: string;
  horaFinInicial?: string;
  cursoSeccionIdInicial?: string | null;
  tipoBloqueInicial?: "clase" | "receso";
  cargaItems: CargaItemHorario[];
  onGuardadoExitoso?: (mensaje?: string, advertencias?: string[]) => void;
}

export function BloqueModal({
  open,
  onOpenChange,
  seccionId,
  bloque,
  diaSemanaInicial,
  horaInicioInicial,
  horaFinInicial,
  cursoSeccionIdInicial,
  tipoBloqueInicial,
  cargaItems,
  onGuardadoExitoso,
}: BloqueModalProps) {
  const crear = useCreateBloqueMutation();
  const editar = useUpdateBloqueMutation();

  const isSubmitting = crear.isPending || editar.isPending;

  const handleSubmit = async (values: BloqueFormValues) => {
    try {
      if (bloque) {
        const res = await editar.mutateAsync({
          id: bloque.id,
          seccionId,
          payload: values,
        });
        onGuardadoExitoso?.(res.mensaje, res.advertencias);
      } else {
        const res = await crear.mutateAsync({
          seccionId,
          payload: values,
        });
        onGuardadoExitoso?.(res.mensaje, res.advertencias);
      }
      onOpenChange(false);
    } catch {
      // Los errores 400 y 409 son notificados mediante toast con el mensaje exacto de la API
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={bloque ? "Editar bloque de horario" : "Registrar bloque de horario"}
      description="Configura la clase o receso escolar. Puedes definir franjas simples o bloques dobles."
      icon={Calendar03Icon}
      size="md"
    >
      {open ? (
        <BloqueForm
          key={bloque?.id ?? `${diaSemanaInicial}-${horaInicioInicial}`}
          bloque={bloque}
          diaSemanaInicial={diaSemanaInicial}
          horaInicioInicial={horaInicioInicial}
          horaFinInicial={horaFinInicial}
          cursoSeccionIdInicial={cursoSeccionIdInicial}
          tipoBloqueInicial={tipoBloqueInicial}
          cargaItems={cargaItems}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      ) : null}
    </Modal>
  );
}
