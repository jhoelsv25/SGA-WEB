"use client";

import * as React from "react";
import { BookOpen01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { UnidadForm } from "../forms/unidad-form";
import type { Bimestre } from "@/features/anio-escolar/types";
import type { Unidad } from "../../types";

interface UnidadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cursoSeccionId: string;
  bimestres: Bimestre[];
  unidad?: Unidad | null;
}

export function UnidadModal({
  open,
  onOpenChange,
  cursoSeccionId,
  bimestres,
  unidad,
}: UnidadModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={unidad ? "Editar unidad" : "Nueva unidad"}
      description="Organiza el aula virtual en unidades, como en tu plan de clase."
      icon={BookOpen01Icon}
      size="xl"
    >
      {open && (
        <UnidadForm
          key={unidad?.id ?? "nueva"}
          cursoSeccionId={cursoSeccionId}
          bimestres={bimestres}
          unidad={unidad}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
