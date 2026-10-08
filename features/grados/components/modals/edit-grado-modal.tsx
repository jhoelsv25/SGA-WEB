"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditGradoForm } from "../forms/edit-grado-form";
import type { Grado } from "../../types";
import type { UpdateGradoFormValues } from "../../schemas";

interface EditGradoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grado: Grado | null;
  onSubmit: (values: UpdateGradoFormValues) => void;
  isLoading?: boolean;
}

export function EditGradoModal({
  open,
  onOpenChange,
  grado,
  onSubmit,
  isLoading,
}: EditGradoModalProps) {
  if (!grado) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Nombre de Grado</DialogTitle>
          <DialogDescription>
            Personalice el nombre oficial con el que se mostrará este grado en reportes y
            asignaciones.
          </DialogDescription>
        </DialogHeader>
        <EditGradoForm
          grado={grado}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
