"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/common/spinner";
import { useAnularIncidenciaMutation } from "../../hooks";
import type { IncidenciaItem } from "../../types";

export interface AnularIncidenciaFormProps {
  incidencia: IncidenciaItem;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function AnularIncidenciaForm({
  incidencia,
  onCancel,
  onSuccess,
}: AnularIncidenciaFormProps) {
  const [motivo, setMotivo] = React.useState("");

  const anularMutation = useAnularIncidenciaMutation({
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivo.trim() || motivo.trim().length < 5) return;

    anularMutation.mutate({
      id: incidencia.id,
      payload: { motivo: motivo.trim() },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="bg-muted/50 border-border space-y-1 rounded-lg border p-3 text-xs">
        <div>
          <strong>Estudiante:</strong> {incidencia.estudianteNombre} ({incidencia.codigoEstudiante})
        </div>
        <div>
          <strong>Incidencia:</strong> {incidencia.tipo.toUpperCase()} - {incidencia.categoria} (
          {incidencia.fecha})
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
          disabled={anularMutation.isPending}
        />
        <p className="text-muted-foreground text-[11px]">
          El motivo quedará sellado de forma permanente en la auditoría general.
        </p>
      </div>

      <div className="flex flex-col-reverse justify-end gap-2 border-t pt-4 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={anularMutation.isPending}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="destructive"
          disabled={anularMutation.isPending || motivo.trim().length < 5}
          className="gap-2"
        >
          {anularMutation.isPending && <Spinner className="size-4" />}
          {anularMutation.isPending ? "Anulando..." : "Confirmar Anulación"}
        </Button>
      </div>
    </form>
  );
}
