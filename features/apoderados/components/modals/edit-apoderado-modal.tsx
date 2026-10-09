"use client";

import { Modal } from "@/components/common/modal";
import { EditApoderadoForm } from "../forms/edit-apoderado-form";
import { useUpdateApoderadoMutation } from "../../hooks/use-apoderados";
import type { Apoderado, UpdateApoderadoPayload } from "../../types/apoderados.types";
import type { UpdateApoderadoFormValues } from "../../schemas/apoderados.schema";

interface EditApoderadoModalProps {
  apoderado: Apoderado | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditApoderadoModal({ apoderado, open, onOpenChange }: EditApoderadoModalProps) {
  const updateMutation = useUpdateApoderadoMutation();

  if (!apoderado) return null;

  const handleSubmit = async (values: UpdateApoderadoFormValues) => {
    const payload: UpdateApoderadoPayload = {
      ocupacion: values.ocupacion || undefined,
      centroLaboral: values.centroLaboral || undefined,
      telefonoLaboral: values.telefonoLaboral || undefined,
      gradoInstruccion: values.gradoInstruccion || undefined,
    };

    try {
      await updateMutation.mutateAsync({ id: apoderado.id, payload });
      onOpenChange(false);
    } catch {
      // Error manejado en mutation toast
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Ficha de Apoderado"
      description={`Actualizar ocupación, centro laboral o grado de instrucción de ${apoderado.persona.nombreCompleto}.`}
      className="max-w-lg"
    >
      <EditApoderadoForm
        apoderado={apoderado}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
