"use client";

import { Modal } from "@/components/common/modal";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { EditDocenteForm } from "../forms/edit-docente-form";
import { useUpdateDocenteMutation } from "../../hooks/use-docentes";
import type { Docente } from "../../types/docentes.types";
import type { EditDocenteFormValues } from "../../schemas/docentes.schema";

interface EditDocenteModalProps {
  docente: Docente | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDocenteModal({ docente, open, onOpenChange }: EditDocenteModalProps) {
  const updateMutation = useUpdateDocenteMutation();

  if (!docente) return null;

  const handleSubmit = async (values: EditDocenteFormValues) => {
    try {
      await updateMutation.mutateAsync({
        id: docente.id,
        input: {
          especialidad: values.especialidad?.trim() || undefined,
          tituloProfesional: values.tituloProfesional?.trim() || undefined,
          tipoContrato: values.tipoContrato,
          jornadaHoras: values.jornadaHoras,
          estado: values.estado,
        },
      });
      onOpenChange(false);
    } catch {
      // Error manejado en mutation toast
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Ficha Docente"
      description="Actualiza especialidad, régimen laboral o jornada del docente."
      icon={Edit02Icon}
      size="lg"
    >
      <EditDocenteForm
        docente={docente}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
