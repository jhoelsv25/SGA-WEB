"use client";

import { Modal } from "@/components/common/modal";
import { VincularApoderadoForm } from "../forms/vincular-apoderado-form";
import { useVincularEstudianteMutation } from "../../hooks/use-apoderados";
import type { Apoderado, VincularEstudiantePayload } from "../../types/apoderados.types";
import type { VincularApoderadoFormValues } from "../../schemas/apoderados.schema";

interface VincularApoderadoModalProps {
  estudianteId: string;
  estudianteNombre?: string;
  apoderado?: Apoderado;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VincularApoderadoModal({
  estudianteId,
  estudianteNombre,
  apoderado,
  open,
  onOpenChange,
}: VincularApoderadoModalProps) {
  const vincularMutation = useVincularEstudianteMutation();

  const handleSubmit = async (values: VincularApoderadoFormValues) => {
    const payload: VincularEstudiantePayload = {
      estudianteId: values.estudianteId,
      apoderadoId: values.apoderadoId,
      parentesco: values.parentesco,
      esPrincipal: values.esPrincipal,
      viveConEstudiante: values.viveConEstudiante,
      autorizadoRecoger: values.autorizadoRecoger,
      contactoEmergencia: values.contactoEmergencia,
    };

    try {
      await vincularMutation.mutateAsync(payload);
      onOpenChange(false);
    } catch {
      // Error manejado en mutation toast
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Vincular Apoderado con Estudiante"
      description="Establecer parentesco y definir responsabilidades escolares y apoderado principal."
      className="max-w-md"
    >
      <VincularApoderadoForm
        estudianteId={estudianteId}
        estudianteNombre={estudianteNombre}
        apoderado={apoderado}
        onSubmit={handleSubmit}
        isLoading={vincularMutation.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
