"use client";

import * as React from "react";
import { FileEditIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useJustificarMarcacion } from "../hooks";
import type { MarcacionApi } from "../types";

interface JustificarMarcacionModalProps {
  marcacion: MarcacionApi | null;
  onOpenChange: (open: boolean) => void;
}

function FormularioJustificacion({
  marcacion,
  onCerrar,
}: {
  marcacion: MarcacionApi;
  onCerrar: () => void;
}) {
  const [motivo, setMotivo] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const justificar = useJustificarMarcacion();

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!motivo.trim()) {
      setError("Indique el motivo de la justificación.");
      return;
    }
    justificar.mutate({ id: marcacion.id, motivo: motivo.trim() }, { onSuccess: onCerrar });
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="motivo-justificacion" className="text-sm font-medium">
          Motivo *
        </Label>
        <Textarea
          id="motivo-justificacion"
          value={motivo}
          onChange={(e) => {
            setMotivo(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Ej. Cita médica con constancia"
          maxLength={500}
          disabled={justificar.isPending}
          aria-invalid={Boolean(error)}
        />
        {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      </div>
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={justificar.isPending} className="min-h-10 gap-2">
          {justificar.isPending && <Spinner className="size-4" />}
          Justificar
        </Button>
      </div>
    </form>
  );
}

export function JustificarMarcacionModal({
  marcacion,
  onOpenChange,
}: JustificarMarcacionModalProps) {
  return (
    <Modal
      open={Boolean(marcacion)}
      onOpenChange={onOpenChange}
      title="Justificar marcación"
      description={
        marcacion
          ? `${marcacion.nombreCompleto}: la marcación conserva su resultado y queda marcada como justificada.`
          : undefined
      }
      icon={FileEditIcon}
      size="md"
    >
      {marcacion && (
        <FormularioJustificacion
          key={marcacion.id}
          marcacion={marcacion}
          onCerrar={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
