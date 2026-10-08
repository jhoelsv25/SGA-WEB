"use client";

import * as React from "react";
import { BookOpen01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { CursoForm } from "../forms/curso-form";
import type { Curso } from "../../types";
import type { CursoFormValues } from "../../schemas";

interface CursoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  curso?: Curso | null;
  onSubmit: (values: CursoFormValues) => Promise<void>;
  isLoading: boolean;
}

export function CursoModal({ open, onOpenChange, curso, onSubmit, isLoading }: CursoModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={curso ? `Editar Curso: ${curso.codigo}` : "Nuevo Curso Curricular o Taller"}
      description={
        curso
          ? "Modifica los datos del curso seleccionado. Se actualizará en los planes de estudio vigentes."
          : "Registra una nueva asignatura en el catálogo institucional. Podrá ser asignada a planes de estudio."
      }
      icon={BookOpen01Icon}
      size="lg"
    >
      <CursoForm
        key={curso?.id ?? "new"}
        curso={curso}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
