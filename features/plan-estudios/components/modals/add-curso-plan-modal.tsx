"use client";

import * as React from "react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import type { Curso } from "@/features/cursos";
import type { Grado } from "@/features/grados";
import { AddCursoPlanForm } from "../forms/add-curso-plan-form";
import type { AddCursoPlanFormValues } from "../../schemas";

interface AddCursoPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grado?: Grado | null;
  availableCursos: Curso[];
  onSubmit: (values: AddCursoPlanFormValues) => Promise<void>;
  isLoading: boolean;
}

export function AddCursoPlanModal({
  open,
  onOpenChange,
  grado,
  availableCursos,
  onSubmit,
  isLoading,
}: AddCursoPlanModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Agregar Asignatura a ${grado?.nombre ?? "Plan de Estudios"}`}
      description="Selecciona una asignatura del catálogo e indica la carga de horas semanales para este grado."
      icon={PlusSignIcon}
      size="md"
    >
      <AddCursoPlanForm
        availableCursos={availableCursos}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
