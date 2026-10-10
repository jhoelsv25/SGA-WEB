"use client";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import type { CargaItemHorario, SeccionHorarioItem } from "../../types";
import type { useHorariosDialogs } from "../../hooks/use-horarios-dialogs";
import { BloqueModal } from "./bloque-modal";
import { CopiarHorarioModal } from "./copiar-horario-modal";
import { ProponerGrillaModal } from "./proponer-grilla-modal";

interface HorariosDialogsContainerProps {
  seccionId: string | null;
  seccionActual?: SeccionHorarioItem;
  seccionesMismoGrado: SeccionHorarioItem[];
  cargaItems: CargaItemHorario[];
  dialogs: ReturnType<typeof useHorariosDialogs>;
  isLoadingPropuesta: boolean;
  onEjecutarPropuestaGrilla: (hora?: string) => void;
  onConfirmarEliminacion: () => void;
  isDeleting: boolean;
  onMensajeVigencia: (msj: string) => void;
}

export function HorariosDialogsContainer({
  seccionId,
  seccionActual,
  seccionesMismoGrado,
  cargaItems,
  dialogs,
  isLoadingPropuesta,
  onEjecutarPropuestaGrilla,
  onConfirmarEliminacion,
  isDeleting,
  onMensajeVigencia,
}: HorariosDialogsContainerProps) {
  if (!seccionId) return null;

  return (
    <>
      <BloqueModal
        open={dialogs.bloqueModalOpen}
        onOpenChange={dialogs.setBloqueModalOpen}
        seccionId={seccionId}
        bloque={dialogs.bloqueAEditar}
        diaSemanaInicial={dialogs.bloqueIniciales.diaSemana}
        horaInicioInicial={dialogs.bloqueIniciales.horaInicio}
        horaFinInicial={dialogs.bloqueIniciales.horaFin}
        cursoSeccionIdInicial={dialogs.bloqueIniciales.cursoSeccionId}
        tipoBloqueInicial={dialogs.bloqueIniciales.tipoBloque}
        cargaItems={cargaItems}
        onGuardadoExitoso={(msj) => {
          if (msj) onMensajeVigencia(msj);
        }}
      />

      <ProponerGrillaModal
        open={dialogs.proponerModalOpen}
        onOpenChange={dialogs.setProponerModalOpen}
        onProponer={onEjecutarPropuestaGrilla}
        isLoading={isLoadingPropuesta}
      />

      {seccionActual && (
        <CopiarHorarioModal
          open={dialogs.copiarModalOpen}
          onOpenChange={dialogs.setCopiarModalOpen}
          seccionDestinoId={seccionId}
          seccionDestinoNombre={seccionActual.nombre}
          seccionesDisponibles={seccionesMismoGrado}
        />
      )}

      <ConfirmDialog
        open={dialogs.eliminarDialogOpen}
        onOpenChange={dialogs.setEliminarDialogOpen}
        title="Eliminar bloque de horario"
        description={
          dialogs.bloqueAEliminar?.tipoBloque === "receso"
            ? `¿Estás seguro de que deseas eliminar el receso de ${dialogs.bloqueAEliminar?.horaInicio} a ${dialogs.bloqueAEliminar?.horaFin}?`
            : `¿Estás seguro de que deseas eliminar el bloque de ${dialogs.bloqueAEliminar?.cursoNombre ?? "clase"} (${dialogs.bloqueAEliminar?.horaInicio} a ${dialogs.bloqueAEliminar?.horaFin})?`
        }
        confirmText="Eliminar bloque"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={onConfirmarEliminacion}
      />
    </>
  );
}
