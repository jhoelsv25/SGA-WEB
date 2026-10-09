"use client";

import { Modal } from "@/components/common/modal";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { EditPersonaForm } from "../forms/edit-persona-form";
import { useSession } from "@/features/auth/hooks/use-auth";
import { useUpdatePersonaMutation } from "../../hooks/use-personas";
import type { Persona } from "../../types/personas.types";
import type { UpdatePersonaFormValues } from "../../schemas/personas.schema";

interface EditPersonaModalProps {
  persona: Persona | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPersonaModal({ persona, open, onOpenChange }: EditPersonaModalProps) {
  const { data: session } = useSession();
  const updateMutation = useUpdatePersonaMutation();

  if (!persona) return null;

  const userRole = session?.user?.activeRoleName || session?.user?.roles?.[0] || "";
  const isAdmin = userRole === "Administrador";
  const isProvisional = persona.esProvisional ?? true;
  const canEditCritical = isProvisional || isAdmin;

  const handleSubmit = async (values: UpdatePersonaFormValues) => {
    try {
      await updateMutation.mutateAsync({
        id: persona.id,
        input: {
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
      title="Editar Datos de Persona"
      description={`${persona.nombreCompleto} — Documento: ${persona.numeroDocumento}`}
      icon={Edit02Icon}
      size="2xl"
    >
      <EditPersonaForm
        key={persona.id}
        persona={persona}
        canEditCritical={canEditCritical}
        isProvisional={isProvisional}
        isAdmin={isAdmin}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
