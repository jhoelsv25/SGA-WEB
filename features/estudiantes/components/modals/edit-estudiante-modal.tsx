"use client";

import { Modal } from "@/components/common/modal";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { EditEstudianteForm } from "../forms/edit-estudiante-form";
import { useUpdateEstudianteMutation } from "../../hooks/use-estudiantes";
import type { Estudiante } from "../../types/estudiantes.types";
import type { UpdateEstudianteFormValues } from "../../schemas/estudiantes.schema";

interface EditEstudianteModalProps {
  estudiante: Estudiante | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditEstudianteModal({ estudiante, open, onOpenChange }: EditEstudianteModalProps) {
  const updateMutation = useUpdateEstudianteMutation();

  if (!estudiante) return null;

  const handleSubmit = async (values: UpdateEstudianteFormValues) => {
    try {
      await updateMutation.mutateAsync({
        id: estudiante.id,
        input: {
          fechaIngreso: values.fechaIngreso || undefined,
          lenguaMaterna: values.lenguaMaterna?.trim() || undefined,
          religion: values.religion?.trim() || undefined,
          tieneDiscapacidad: values.tieneDiscapacidad,
          detalleDiscapacidad: values.tieneDiscapacidad
            ? values.detalleDiscapacidad?.trim() || undefined
            : undefined,
          grupoSanguineo: values.grupoSanguineo?.trim() || undefined,
          alergias: values.alergias?.trim() || undefined,
          condicionesMedicas: values.condicionesMedicas?.trim() || undefined,
          seguroSalud: values.seguroSalud?.trim() || undefined,
          estado: values.estado,
          motivo: values.motivo?.trim() || undefined,
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
      title="Editar Ficha de Estudiante"
      description={`Actualiza la información médica y escolar de ${estudiante.persona.nombreCompleto}.`}
      icon={Edit02Icon}
      size="xl"
    >
      <EditEstudianteForm
        estudiante={estudiante}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
