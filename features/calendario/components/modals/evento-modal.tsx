"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { useCreateEventoMutation, useUpdateEventoMutation } from "../../hooks";
import type { EventoCalendario } from "../../types";
import { EventoForm } from "../forms/evento-form";

interface EventoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evento?: EventoCalendario | null;
  dia?: string;
  anioAcademicoId: string;
}

export function EventoModal({
  open,
  onOpenChange,
  evento,
  dia,
  anioAcademicoId,
}: EventoModalProps) {
  const crear = useCreateEventoMutation();
  const editar = useUpdateEventoMutation();
  const borrador: EventoCalendario | null =
    evento ??
    (dia
      ? {
          id: "",
          anioAcademicoId,
          titulo: "",
          descripcion: null,
          tipo: "feriado",
          fechaInicio: dia,
          fechaFin: dia,
          suspendeClases: true,
        }
      : null);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={evento ? "Editar evento" : "Registrar evento"}
      description="Un feriado o una suspensión suspende clases. Las sesiones ya firmadas se conservan."
      icon={Calendar03Icon}
      size="lg"
    >
      {open ? (
        <EventoForm
          key={evento?.id ?? dia ?? "nuevo"}
          evento={borrador}
          isSubmitting={crear.isPending || editar.isPending}
          onCancel={() => onOpenChange(false)}
          onSubmit={async (values) => {
            if (evento) {
              await editar.mutateAsync({ id: evento.id, payload: values });
            } else {
              await crear.mutateAsync(values);
            }
            onOpenChange(false);
          }}
        />
      ) : null}
    </Modal>
  );
}
