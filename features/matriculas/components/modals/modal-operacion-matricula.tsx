"use client";

import { Modal } from "@/components/common/modal";
import {
  UserRemove01Icon,
  Exchange01Icon,
  Delete02Icon,
  SchoolIcon,
} from "@hugeicons/core-free-icons";
import {
  OperacionMatriculaForm,
  type OperacionMatriculaTipo,
} from "../forms/operacion-matricula-form";
import type { MatriculaItem } from "../../types";

interface ModalOperacionMatriculaProps {
  matricula: MatriculaItem | null;
  tipo: OperacionMatriculaTipo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MODAL_CONFIG: Record<
  string,
  { title: string; description: string; icon: typeof UserRemove01Icon }
> = {
  retirar: {
    title: "Registrar Retiro del Estudiante",
    description: "Registra el retiro formal del colegio y revoca sus credenciales (RF-009 HU3).",
    icon: UserRemove01Icon,
  },
  trasladar: {
    title: "Registrar Traslado a Otro Colegio",
    description:
      "Registra el traslado definitivo, libera la vacante y desactiva el acceso (RF-009 HU3).",
    icon: SchoolIcon,
  },
  "cambiar-seccion": {
    title: "Cambiar de Sección",
    description:
      "Reasigna al estudiante a otra sección dentro del mismo grado con vacantes disponibles (RF-009 HU3).",
    icon: Exchange01Icon,
  },
  anular: {
    title: "Anular Matrícula Registrada",
    description:
      "Elimina la matrícula por error material siempre que no tenga asistencias ni notas registradas.",
    icon: Delete02Icon,
  },
};

export function ModalOperacionMatricula({
  matricula,
  tipo,
  open,
  onOpenChange,
}: ModalOperacionMatriculaProps) {
  if (!matricula || !tipo) return null;

  const config = MODAL_CONFIG[tipo] || {
    title: "Operación de Matrícula",
    description: "Gestión administrativa de matrícula",
    icon: Exchange01Icon,
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={config.title}
      description={config.description}
      icon={config.icon}
      size="md"
    >
      <OperacionMatriculaForm
        matricula={matricula}
        tipo={tipo}
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
