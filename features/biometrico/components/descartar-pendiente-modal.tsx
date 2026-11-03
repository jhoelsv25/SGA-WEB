"use client";

import * as React from "react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MENSAJE_MOTIVO_DESCARTE } from "../consts";
import { useDescartarPendiente } from "../hooks";
import type { PendienteApi } from "../types";

interface DescartarPendienteModalProps {
  pendiente: PendienteApi | null;
  onOpenChange: (open: boolean) => void;
}

function Formulario({ pendiente, onCerrar }: { pendiente: PendienteApi; onCerrar: () => void }) {
  const [motivo, setMotivo] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const descartar = useDescartarPendiente();

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!motivo.trim()) {
      setError(MENSAJE_MOTIVO_DESCARTE);
      return;
    }
    descartar.mutate({ id: pendiente.id, motivo: motivo.trim() }, { onSuccess: onCerrar });
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="motivo-descarte" className="text-sm font-medium">
          Motivo *
        </Label>
        <Textarea
          id="motivo-descarte"
          value={motivo}
          onChange={(e) => {
            setMotivo(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Ej. Visita que usó el reloj por error"
          maxLength={500}
          disabled={descartar.isPending}
          aria-invalid={Boolean(error)}
        />
        {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      </div>
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="destructive"
          disabled={descartar.isPending}
          className="min-h-10 gap-2"
        >
          {descartar.isPending && <Spinner className="size-4" />}
          Descartar
        </Button>
      </div>
    </form>
  );
}

export function DescartarPendienteModal({ pendiente, onOpenChange }: DescartarPendienteModalProps) {
  return (
    <Modal
      open={Boolean(pendiente)}
      onOpenChange={onOpenChange}
      title="Descartar marcación"
      description={
        pendiente
          ? `Código ${pendiente.codigoBiometrico} · ${pendiente.fechaHora.slice(0, 16)}. No se registrará como asistencia.`
          : undefined
      }
      icon={Delete02Icon}
      size="md"
    >
      {pendiente && (
        <Formulario key={pendiente.id} pendiente={pendiente} onCerrar={() => onOpenChange(false)} />
      )}
    </Modal>
  );
}
