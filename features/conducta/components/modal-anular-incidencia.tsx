"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAnularIncidenciaMutation } from "../hooks";
import type { IncidenciaItem } from "../types";

interface ModalAnularIncidenciaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incidencia: IncidenciaItem | null;
}

export function ModalAnularIncidencia({
  open,
  onOpenChange,
  incidencia,
}: ModalAnularIncidenciaProps) {
  const [motivo, setMotivo] = React.useState("");

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      setMotivo("");
    }
    onOpenChange(newOpen);
  };

  const anularMutation = useAnularIncidenciaMutation({
    onSuccess: () => {
      handleClose(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidencia || !motivo.trim() || motivo.trim().length < 5) return;

    anularMutation.mutate({
      id: incidencia.id,
      payload: { motivo: motivo.trim() },
    });
  };

  if (!incidencia) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <HugeiconsIcon icon={AlertCircleIcon} className="h-5 w-5" />
              Anular Registro de Incidencia
            </DialogTitle>
            <DialogDescription>
              Esta acción dará de baja la incidencia y se registrará un evento inmutable en la
              bitácora de auditoría del sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/50 border-border space-y-1 rounded-lg border p-3 text-xs">
            <div>
              <strong>Estudiante:</strong> {incidencia.estudianteNombre} (
              {incidencia.codigoEstudiante})
            </div>
            <div>
              <strong>Incidencia:</strong> {incidencia.tipo.toUpperCase()} - {incidencia.categoria}{" "}
              ({incidencia.fecha})
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo-anulacion">
              Motivo de anulación <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="motivo-anulacion"
              placeholder="Explique detalladamente el motivo de la anulación (mínimo 5 caracteres)..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
              rows={3}
              minLength={5}
              maxLength={500}
            />
            <p className="text-muted-foreground text-[11px]">
              El motivo quedará sellado de forma permanente en la auditoría general.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={anularMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={anularMutation.isPending || motivo.trim().length < 5}
            >
              {anularMutation.isPending ? "Anulando..." : "Confirmar Anulación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
