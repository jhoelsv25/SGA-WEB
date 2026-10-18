"use client";

import * as React from "react";
import type { Persona } from "@/features/personas/types/personas.types";
import { Modal } from "@/components/common/modal";
import { CreateApoderadoForm } from "../forms/create-apoderado-form";
import { useCreateApoderadoMutation } from "../../hooks/use-apoderados";
import type { CreateApoderadoPayload, CreateApoderadoResponse } from "../../types/apoderados.types";
import type { CreateApoderadoFormValues } from "../../schemas/apoderados.schema";
import { User02FreeIcons } from "@hugeicons/core-free-icons";

interface CreateApoderadoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Persona del padrón ya elegida en la búsqueda; sin ella se registra una persona nueva. */
  persona?: Persona | null;
  estudianteId?: string;
  estudianteNombre?: string;
  onSuccess?: (response: CreateApoderadoResponse) => void;
}

export function CreateApoderadoModal({
  open,
  onOpenChange,
  persona,
  estudianteId,
  estudianteNombre,
  onSuccess,
}: CreateApoderadoModalProps) {
  const createMutation = useCreateApoderadoMutation((data) => {
    onSuccess?.(data);
    onOpenChange(false);
  });

  const handleSubmit = async (values: CreateApoderadoFormValues) => {
    const payload: CreateApoderadoPayload = {
      personaId: values.personaId || undefined,
      ocupacion: values.ocupacion || undefined,
      centroLaboral: values.centroLaboral || undefined,
      telefonoLaboral: values.telefonoLaboral || undefined,
      gradoInstruccion: values.gradoInstruccion || undefined,
      estudianteId: values.estudianteId || undefined,
      parentesco: values.parentesco || undefined,
      esPrincipal: values.esPrincipal,
      viveConEstudiante: values.viveConEstudiante,
      autorizadoRecoger: values.autorizadoRecoger,
      contactoEmergencia: values.contactoEmergencia,
      nuevaPersona: values.nuevaPersona
        ? {
            tipoDocumento: values.nuevaPersona.tipoDocumento,
            numeroDocumento: values.nuevaPersona.numeroDocumento,
            nombres: values.nuevaPersona.nombres,
            apellidoPaterno: values.nuevaPersona.apellidoPaterno,
            apellidoMaterno: values.nuevaPersona.apellidoMaterno || undefined,
            sexo: values.nuevaPersona.sexo,
            fechaNacimiento: values.nuevaPersona.fechaNacimiento || undefined,
            direccion: values.nuevaPersona.direccion || undefined,
            distrito: values.nuevaPersona.distrito || undefined,
            celular: values.nuevaPersona.celular || undefined,
            correo: values.nuevaPersona.correo || undefined,
          }
        : undefined,
    };

    await createMutation.mutateAsync(payload);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Registrar Apoderado"
      icon={User02FreeIcons}
      description="Registro de ficha de apoderado, asignación de rol, cargo y vinculación escolar."
      size="2xl"
    >
      <CreateApoderadoForm
        persona={persona}
        estudianteId={estudianteId}
        estudianteNombre={estudianteNombre}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
