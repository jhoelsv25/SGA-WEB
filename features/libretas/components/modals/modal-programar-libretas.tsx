"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { ProgramarLibretasForm } from "../forms";
import { useCambiarFechaLibretasMutation, useProgramarLibretasMutation } from "../../hooks";
import type { PeriodoLibreta } from "../../types";

interface ModalProgramarLibretasProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  periodos: PeriodoLibreta[];
  periodo?: PeriodoLibreta;
}

export function ModalProgramarLibretas({
  open,
  onOpenChange,
  periodos,
  periodo,
}: ModalProgramarLibretasProps) {
  const programar = useProgramarLibretasMutation(() => onOpenChange(false));
  const cambiar = useCambiarFechaLibretasMutation(() => onOpenChange(false));
  const esCambio = Boolean(periodo?.programada);
  const pendiente = esCambio ? cambiar.isPending : programar.isPending;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={esCambio ? "Cambiar la fecha límite" : "Fijar la fecha límite"}
      description={
        esCambio
          ? "La nueva fecha se aplica solo a las libretas que aún no se publican."
          : "Crea las libretas pendientes del bimestre y fija hasta cuándo se publican a tiempo."
      }
      icon={Calendar03Icon}
      size="lg"
    >
      <ProgramarLibretasForm
        periodos={periodos}
        periodoFijo={periodo}
        isLoading={pendiente}
        onCancel={() => onOpenChange(false)}
        onSubmit={(valores) => {
          if (esCambio && periodo) {
            cambiar.mutate({ periodoId: periodo.id, fechaLimite: valores.fechaLimite });
            return;
          }
          programar.mutate(valores);
        }}
      />
    </Modal>
  );
}
