"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, SentIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/common/spinner";
import { DatePicker } from "@/components/common/date-picker";
import { useSolicitarCambioFecha } from "../../hooks";
import type { Material } from "../../types";

function aISO(fecha: Date | undefined): string {
  if (!fecha) return "";
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(
    fecha.getDate(),
  ).padStart(2, "0")}`;
}

interface SolicitarCambioFechaFormProps {
  material: Material;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function SolicitarCambioFechaForm({
  material,
  onCancel,
  onSuccess,
}: SolicitarCambioFechaFormProps) {
  const [fecha, setFecha] = React.useState<Date | undefined>();
  const [motivo, setMotivo] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const solicitar = useSolicitarCambioFecha();

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!fecha) {
      setError("Ingrese la nueva fecha programada.");
      return;
    }
    if (!motivo.trim()) {
      setError("Indique el motivo del cambio de fecha.");
      return;
    }
    solicitar.mutate(
      { id: material.id, fechaSolicitada: aISO(fecha), motivo: motivo.trim() },
      { onSuccess },
    );
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Nueva fecha programada *</Label>
        <DatePicker date={fecha} onSelect={setFecha} disabled={solicitar.isPending} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cambio-motivo" className="text-sm font-medium">
          Motivo *
        </Label>
        <Textarea
          id="cambio-motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Ej. Se suspendieron clases el 28/05"
          maxLength={500}
          disabled={solicitar.isPending}
        />
      </div>
      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10 gap-2" onClick={onCancel}>
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
          <span>Cancelar</span>
        </Button>
        <Button type="submit" disabled={solicitar.isPending} className="min-h-10 gap-2">
          {solicitar.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <HugeiconsIcon icon={SentIcon} size={16} />
          )}
          <span>Enviar solicitud</span>
        </Button>
      </div>
    </form>
  );
}
