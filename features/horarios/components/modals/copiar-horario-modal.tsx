"use client";

import { useState } from "react";
import { Copy01Icon, AlertCircleIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { useCopiarHorarioMutation } from "../../hooks";
import type { ConflictoHorarioCopia, SeccionHorarioItem } from "../../types";
import { CopiarHorarioForm } from "../forms/copiar-horario-form";
import type { CopiarHorarioFormValues } from "../../schemas";
import { nombreDiaSemana } from "../../utils";

interface CopiarHorarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seccionDestinoId: string;
  seccionDestinoNombre: string;
  seccionesDisponibles: SeccionHorarioItem[];
}

export function CopiarHorarioModal({
  open,
  onOpenChange,
  seccionDestinoId,
  seccionDestinoNombre,
  seccionesDisponibles,
}: CopiarHorarioModalProps) {
  const copiarMutation = useCopiarHorarioMutation();
  const [conflictosDetectados, setConflictosDetectados] = useState<ConflictoHorarioCopia[] | null>(
    null,
  );
  const [totalCreados, setTotalCreados] = useState<number>(0);

  const handleCerrar = (nuevoOpen: boolean) => {
    if (!nuevoOpen) {
      setConflictosDetectados(null);
      setTotalCreados(0);
    }
    onOpenChange(nuevoOpen);
  };

  const handleSubmit = async (values: CopiarHorarioFormValues) => {
    try {
      const res = await copiarMutation.mutateAsync({
        destinoId: seccionDestinoId,
        origenId: values.origenId,
      });

      if (res.conflictos && res.conflictos.length > 0) {
        setConflictosDetectados(res.conflictos);
        setTotalCreados(res.bloquesCreados);
      } else {
        handleCerrar(false);
      }
    } catch {
      // Notificado por ApiClientError
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleCerrar}
      title={
        conflictosDetectados
          ? "Resultado de copia: conflictos de docente"
          : "Copiar horario a otra sección"
      }
      description={
        conflictosDetectados
          ? `Se crearon ${totalCreados} bloques. Se detectaron cruces de docente que debes verificar.`
          : `Copia la distribución de bloques a la sección ${seccionDestinoNombre}.`
      }
      icon={conflictosDetectados ? AlertCircleIcon : Copy01Icon}
      size="lg"
    >
      {open ? (
        conflictosDetectados ? (
          <div className="space-y-4">
            <div className="border-warning/30 bg-warning/12 text-warning-text rounded-lg border p-3.5 text-xs">
              <p className="font-semibold">
                Atención: Los siguientes docentes ya tienen horas asignadas en otra sección en el
                mismo horario:
              </p>
              <p className="mt-1">
                Los bloques fueron creados para conservar la grilla, pero deberás reasignar los
                docentes o ajustar las horas en una de las secciones.
              </p>
            </div>

            <div className="border-border max-h-64 space-y-2 overflow-y-auto rounded-md border p-2">
              {conflictosDetectados.map((conflicto, idx) => (
                <div
                  key={`${conflicto.diaSemana}-${conflicto.horaInicio}-${idx}`}
                  className="border-border/80 bg-muted/40 rounded border p-2.5 text-xs"
                >
                  <div className="text-foreground flex items-center justify-between font-medium">
                    <span>
                      {nombreDiaSemana(conflicto.diaSemana)}: {conflicto.horaInicio} –{" "}
                      {conflicto.horaFin}
                    </span>
                    <span className="bg-background text-primary rounded px-2 py-0.5 font-semibold">
                      {conflicto.cursoNombre}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1">{conflicto.mensaje}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={() => handleCerrar(false)}
                className="h-10 min-h-[44px] gap-1.5 rounded-full px-5 text-xs font-semibold"
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
                <span>Entendido y revisar grilla</span>
              </Button>
            </div>
          </div>
        ) : (
          <CopiarHorarioForm
            seccionesDisponibles={seccionesDisponibles}
            seccionDestinoNombre={seccionDestinoNombre}
            onSubmit={handleSubmit}
            onCancel={() => handleCerrar(false)}
            isSubmitting={copiarMutation.isPending}
          />
        )
      ) : null}
    </Modal>
  );
}
