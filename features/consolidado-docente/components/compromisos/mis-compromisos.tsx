"use client";

import * as React from "react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { useCompromisoEnteradoMutation, useCompromisosQuery } from "../../hooks";
import { CompromisoTarjeta } from "./compromiso-tarjeta";

export interface MisCompromisosProps {
  consolidadoId: string;
}

/** Compromisos del docente en «Mi seguimiento»: solo los suyos y sin historial de versiones. */
export function MisCompromisos({ consolidadoId }: MisCompromisosProps) {
  const { data: compromisos = [], isLoading } = useCompromisosQuery(consolidadoId);
  const { mutate: marcarEnterado, isPending, variables } = useCompromisoEnteradoMutation();

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 py-4 text-xs">
        <Spinner className="size-4" />
        <span>Cargando compromisos...</span>
      </div>
    );
  }

  // Sin compromisos no hay nada que mostrar: el bloque aparece solo cuando existen.
  if (compromisos.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-foreground text-sm font-semibold">Mis compromisos de mejora</h3>
        <p className="text-muted-foreground text-xs">
          Lo acordado con la Dirección. «Enterado» deja registrada la fecha y hora en que lo leyó;
          no cambia el estado del compromiso.
        </p>
      </div>
      <ul className="space-y-2">
        {compromisos.map((c) => (
          <CompromisoTarjeta
            key={c.id}
            compromiso={c}
            acciones={
              !c.enteradoEn && !c.anulado ? (
                <Button
                  size="sm"
                  onClick={() => marcarEnterado(c.compromisoId)}
                  disabled={isPending && variables === c.compromisoId}
                  className="gap-1.5"
                >
                  {isPending && variables === c.compromisoId ? (
                    <Spinner className="size-3.5" />
                  ) : (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
                  )}
                  <span>Enterado</span>
                </Button>
              ) : null
            }
          />
        ))}
      </ul>
    </div>
  );
}
