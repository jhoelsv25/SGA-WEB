"use client";

import * as React from "react";
import { FileEditIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useJustificarFalta } from "../hooks";

export interface FaltaAJustificar {
  id: string;
  cursoNombre: string;
  fecha: string;
}

interface JustificarFaltaModalProps {
  falta: FaltaAJustificar | null;
  onOpenChange: (open: boolean) => void;
}

function FormularioFalta({ falta, onCerrar }: { falta: FaltaAJustificar; onCerrar: () => void }) {
  const [motivo, setMotivo] = React.useState("");
  const [documentoUrl, setDocumentoUrl] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const justificar = useJustificarFalta();

  const enviar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!motivo.trim()) {
      setError("Indique el motivo de la justificación.");
      return;
    }
    justificar.mutate(
      { id: falta.id, motivo: motivo.trim(), documentoUrl: documentoUrl.trim() || undefined },
      { onSuccess: onCerrar },
    );
  };

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="motivo-falta" className="text-sm font-medium">
          Motivo *
        </Label>
        <Textarea
          id="motivo-falta"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Ej. Certificado médico"
          maxLength={500}
          disabled={justificar.isPending}
          aria-invalid={Boolean(error)}
        />
        {error && <p className="text-destructive text-xs font-medium">{error}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="documento-falta" className="text-sm font-medium">
          Enlace del documento (opcional)
        </Label>
        <Input
          id="documento-falta"
          value={documentoUrl}
          onChange={(e) => setDocumentoUrl(e.target.value)}
          placeholder="https://…"
          maxLength={255}
          disabled={justificar.isPending}
        />
      </div>
      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" className="min-h-10" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={justificar.isPending} className="min-h-10 gap-2">
          {justificar.isPending && <Spinner className="size-4" />}
          Justificar falta
        </Button>
      </div>
    </form>
  );
}

export function JustificarFaltaModal({ falta, onOpenChange }: JustificarFaltaModalProps) {
  return (
    <Modal
      open={Boolean(falta)}
      onOpenChange={onOpenChange}
      title="Justificar falta"
      description={
        falta
          ? `${falta.cursoNombre} · ${falta.fecha.slice(0, 10).split("-").reverse().join("/")}`
          : undefined
      }
      icon={FileEditIcon}
      size="md"
    >
      {falta && (
        <FormularioFalta key={falta.id} falta={falta} onCerrar={() => onOpenChange(false)} />
      )}
    </Modal>
  );
}
