"use client";

import { Modal } from "@/components/common/modal";
import { UserAdd01Icon } from "@hugeicons/core-free-icons";
import { CreatePersonaForm } from "../forms/create-persona-form";
import { useCreatePersonaMutation } from "../../hooks/use-personas";
import type { CreatePersonaFormValues } from "../../schemas/personas.schema";

interface CreatePersonaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePersonaModal({ open, onOpenChange }: CreatePersonaModalProps) {
  const createMutation = useCreatePersonaMutation();

  const handleSubmit = async (values: CreatePersonaFormValues) => {
    try {
      await createMutation.mutateAsync({
        tipoDocumento: values.tipoDocumento,
        numeroDocumento: values.numeroDocumento,
        nombres: values.nombres,
        apellidoPaterno: values.apellidoPaterno,
        apellidoMaterno: values.apellidoMaterno || undefined,
        sexo: values.sexo,
        fechaNacimiento: values.fechaNacimiento || undefined,
        direccion: values.direccion || undefined,
        distrito: values.distrito || undefined,
        celular: values.celular || undefined,
        telefono: values.telefono || undefined,
        correo: values.correo || undefined,
        fotoUrl: values.fotoUrl || undefined,
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
      title="Registrar Persona en Padrón"
      description="Incorpora una nueva persona al padrón único de la institución escolar."
      icon={UserAdd01Icon}
      size="2xl"
    >
      <CreatePersonaForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
