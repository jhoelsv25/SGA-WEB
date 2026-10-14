"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/common/spinner";
import { toast } from "@/lib/toast";
import { MENSAJES_VALIDACION } from "../../consts";
import { useOcultarContenido } from "../../hooks";
import type { TipoModeracion } from "../../types";

export interface OcultarContenidoTarget {
  tipo: TipoModeracion;
  id: string;
  descripcion?: string;
}

interface OcultarContenidoFormProps {
  target: OcultarContenidoTarget;
  cursoSeccionId: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function OcultarContenidoForm({
  target,
  cursoSeccionId,
  onCancel,
  onSuccess,
}: OcultarContenidoFormProps) {
  const [motivo, setMotivo] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const ocultar = useOcultarContenido(cursoSeccionId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = motivo.trim();
    if (!trimmed) {
      setError(MENSAJES_VALIDACION.MOTIVO_REQUERIDO);
      toast.error(MENSAJES_VALIDACION.MOTIVO_REQUERIDO);
      return;
    }

    ocultar.mutate(
      {
        tipo: target.tipo,
        id: target.id,
        motivo: trimmed,
      },
      {
        onSuccess,
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {target.descripcion && (
        <div className="bg-muted/50 text-muted-foreground line-clamp-3 rounded-md border p-3 text-xs italic">
          &ldquo;{target.descripcion}&rdquo;
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="motivo-moderacion" className="text-sm font-medium">
          Motivo de moderación *
        </Label>
        <Textarea
          id="motivo-moderacion"
          value={motivo}
          onChange={(e) => {
            setMotivo(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Ej.: Lenguaje inapropiado, contenido fuera de tema, etc."
          rows={3}
          disabled={ocultar.isPending}
          className={error ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={ocultar.isPending}>
          Cancelar
        </Button>
        <Button type="submit" variant="destructive" disabled={ocultar.isPending} className="gap-2">
          {ocultar.isPending && <Spinner className="size-4" />}
          Ocultar contenido
        </Button>
      </div>
    </form>
  );
}
