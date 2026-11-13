"use client";

import * as React from "react";
import { SelectOption } from "@/components/common/select";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters/date";
import { RESULTADOS_COMPROMISO } from "../consts";
import { useCerrarCompromisoObservacion } from "../hooks";
import type { Compromiso, ResultadoCompromiso } from "../types";

const ESTADO_COMPROMISO = {
  pendiente: { label: "Pendiente", tone: "warning" },
  cumplido: { label: "Cumplido", tone: "success" },
  no_cumplido: { label: "No cumplido", tone: "danger" },
} as const;

interface ListaCompromisosProps {
  compromisos: Compromiso[];
  /** Si puede marcar el resultado (observador). */
  puedeCerrar: boolean;
  onSugerirReobservacion?: () => void;
}

export function ListaCompromisos({
  compromisos,
  puedeCerrar,
  onSugerirReobservacion,
}: ListaCompromisosProps) {
  const cerrar = useCerrarCompromisoObservacion();
  const [resultado, setResultado] = React.useState<Record<string, ResultadoCompromiso | undefined>>(
    {},
  );

  if (compromisos.length === 0) {
    return <p className="text-muted-foreground text-sm">Sin compromisos de mejora.</p>;
  }
  return (
    <ul className="space-y-2">
      {compromisos.map((c) => {
        const estado = ESTADO_COMPROMISO[c.estado];
        const elegido = resultado[c.compromisoId];
        return (
          <li
            key={c.id}
            className="border-border/70 bg-card space-y-2 rounded-xl border p-3 text-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">Desempeño {c.desempeno}</p>
              <div className="flex items-center gap-2">
                {c.vencido && <StatusBadge tone="danger">Revisión vencida</StatusBadge>}
                <StatusBadge tone={estado.tone}>{estado.label}</StatusBadge>
              </div>
            </div>
            <p>{c.descripcion}</p>
            <p className="text-muted-foreground text-xs">Revisión: {formatDate(c.fechaRevision)}</p>
            {puedeCerrar && c.estado === "pendiente" && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-44">
                  <SelectOption
                    options={RESULTADOS_COMPROMISO.map((r) => ({ value: r.value, label: r.label }))}
                    value={elegido}
                    onSelect={(valor) =>
                      setResultado((prev) => ({
                        ...prev,
                        [c.compromisoId]: valor as ResultadoCompromiso,
                      }))
                    }
                    placeholder="Resultado"
                    disabled={cerrar.isPending}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-10"
                  disabled={!elegido || cerrar.isPending}
                  onClick={() =>
                    elegido &&
                    cerrar.mutate(
                      { compromisoId: c.compromisoId, resultado: elegido },
                      {
                        onSuccess: (respuesta) => {
                          if (respuesta.sugerirReobservacion) onSugerirReobservacion?.();
                        },
                      },
                    )
                  }
                >
                  Cerrar compromiso
                </Button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
