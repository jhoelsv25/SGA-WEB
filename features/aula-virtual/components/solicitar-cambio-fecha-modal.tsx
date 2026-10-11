"use client";

import * as React from "react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/common/date-picker";
import { useSolicitarCambioFecha } from "../hooks";
import type { Material } from "../types";

interface SolicitarCambioFechaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: Material | null;
}

function aISO(fecha: Date | undefined): string {
  if (!fecha) return "";
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(
    fecha.getDate(),
  ).padStart(2, "0")}`;
}

function FormularioCambio({ material, onCerrar }: { material: Material; onCerrar: () => void }) {
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
      { onSuccess: onCerrar },
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
        <Button type="button" variant="outline" className="min-h-10" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={solicitar.isPending} className="min-h-10 gap-2">
          {solicitar.isPending && <Spinner className="size-4" />}
          Enviar solicitud
        </Button>
      </div>
    </form>
  );
}

export function SolicitarCambioFechaModal({
  open,
  onOpenChange,
  material,
}: SolicitarCambioFechaModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Solicitar cambio de fecha"
      description={material ? `${material.titulo} · fecha congelada` : undefined}
      icon={Calendar03Icon}
      size="md"
    >
      {material && (
        <FormularioCambio
          key={material.id}
          material={material}
          onCerrar={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
