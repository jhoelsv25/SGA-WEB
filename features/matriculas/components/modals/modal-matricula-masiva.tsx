"use client";

import * as React from "react";
import { Modal } from "@/components/common/modal";
import { UserGroupIcon, CheckmarkCircle02Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { MatriculaMasivaForm } from "../forms/matricula-masiva-form";
import type { MatriculaMasivaResponse } from "../../types";

interface ModalMatriculaMasivaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModalMatriculaMasiva({ open, onOpenChange }: ModalMatriculaMasivaProps) {
  const [resultado, setResultado] = React.useState<MatriculaMasivaResponse | null>(null);

  const handleClose = () => {
    setResultado(null);
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title="Matrícula Masiva de Continuadores"
      description="Matricula masivamente a estudiantes promovidos en el grado superior respetando el tope de vacantes."
      icon={UserGroupIcon}
      size="xl"
    >
      {resultado ? (
        <div className="space-y-4">
          <div className="space-y-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs">
            <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5" />
              <span>Proceso Masivo Completado</span>
            </div>
            <p className="text-muted-foreground">
              Se matricularon con éxito <strong>{resultado.totalMatriculados}</strong> estudiantes
              en la sección destino.
            </p>
          </div>

          {resultado.noMatriculados.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                <HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
                <span>Estudiantes no procesados ({resultado.noMatriculados.length})</span>
              </div>
              <div className="border-border/70 max-h-40 space-y-1.5 overflow-y-auto rounded-xl border p-2 text-xs">
                {resultado.noMatriculados.map((item, idx) => (
                  <div
                    key={idx}
                    className="border-border/40 flex justify-between border-b p-1.5 last:border-b-0"
                  >
                    <span className="text-foreground font-medium">{item.estudianteNombre}</span>
                    <span className="text-muted-foreground text-[11px] italic">{item.motivo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-border/40 flex justify-end border-t pt-2">
            <Button
              type="button"
              size="sm"
              onClick={handleClose}
              className="h-9 rounded-full px-4 text-xs shadow-xs"
            >
              Cerrar y Actualizar
            </Button>
          </div>
        </div>
      ) : (
        <MatriculaMasivaForm onSuccess={(res) => setResultado(res)} onCancel={handleClose} />
      )}
    </Modal>
  );
}
