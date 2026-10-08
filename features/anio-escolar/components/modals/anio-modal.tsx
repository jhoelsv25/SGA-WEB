"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { useCreateAnioMutation } from "../../hooks";
import { AnioForm } from "../forms/anio-form";

interface AnioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnioModal({ open, onOpenChange }: AnioModalProps) {
  const crear = useCreateAnioMutation();

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Nuevo año escolar"
      description="Queda en planificado hasta que completes los bimestres e inicies el año."
      icon={Calendar03Icon}
      size="2xl"
    >
      <AnioForm
        isSubmitting={crear.isPending}
        onCancel={() => onOpenChange(false)}
        onSubmit={async (values) => {
          await crear.mutateAsync({
            anio: values.anio,
            nombre: values.nombre,
            fechaInicio: values.fechaInicio,
            fechaFin: values.fechaFin,
            bimestres: values.bimestres,
          });
          onOpenChange(false);
        }}
      />
    </Modal>
  );
}
