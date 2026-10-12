"use client";

import { Modal } from "@/components/common/modal";
import { IdVerifiedIcon } from "@hugeicons/core-free-icons";
import { CargoForm } from "../forms/cargo-form";
import { useCreateCargoMutation, useUpdateCargoMutation } from "../../hooks/use-cargos-mutations";
import type { CargoItem } from "../../types/cargos.types";
import type { CreateCargoFormValues } from "../../schemas/cargos.schema";

interface CargoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cargoToEdit?: CargoItem | null;
}

export function CargoModal({ open, onOpenChange, cargoToEdit }: CargoModalProps) {
  const createMutation = useCreateCargoMutation(() => onOpenChange(false));
  const updateMutation = useUpdateCargoMutation(() => onOpenChange(false));

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (values: CreateCargoFormValues) => {
    if (cargoToEdit) {
      await updateMutation.mutateAsync({
        id: cargoToEdit.id,
        input: {
          nombre: values.nombre,
          descripcion: values.descripcion,
          rolesSugeridosIds: values.rolesSugeridosIds,
        },
      });
    } else {
      await createMutation.mutateAsync({
        nombre: values.nombre,
        descripcion: values.descripcion,
        rolesSugeridosIds: values.rolesSugeridosIds,
      });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={cargoToEdit ? "Editar cargo" : "Crear cargo"}
      description="El cargo es el puesto en el colegio: no da accesos, solo sugiere roles al registrar una cuenta."
      icon={IdVerifiedIcon}
      size="md"
    >
      <CargoForm
        initialData={cargoToEdit}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
