"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import type { EvolucionApoyoDto } from "../../types";

interface EvolucionApoyoProps {
  evolucion: EvolucionApoyoDto[];
  etiquetaSinDatos: string;
}

/**
 * Evolución de las jornadas efectivas por bimestre (RF-020 V2). El bimestre en curso lleva
 * el aviso que entrega la API. Solo informativo: sin meta ni semáforo.
 */
export function EvolucionApoyo({ evolucion, etiquetaSinDatos }: EvolucionApoyoProps) {
  if (evolucion.length === 0) {
    return (
      <Card className="border-border/60 text-muted-foreground p-6 text-center text-xs">
        {etiquetaSinDatos}
      </Card>
    );
  }

  return (
    <Card className="border-border/60 space-y-4 p-4 sm:p-5">
      <div>
        <h3 className="text-foreground text-base font-semibold">
          Evolución de las jornadas efectivas
        </h3>
        <p className="text-muted-foreground text-xs">Valor de cada bimestre del año lectivo.</p>
      </div>
      <ul className="space-y-3">
        {evolucion.map((item) => {
          const r = item.resumen.jornadasEfectivas;
          const valor = r.sinDatos || r.valor === null ? null : r.valor;
          return (
            <li key={item.periodoId} className="space-y-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="text-foreground font-medium">{item.periodoNombre}</span>
                <span
                  className={
                    valor === null ? "text-muted-foreground" : "text-foreground tabular-nums"
                  }
                >
                  {valor === null ? etiquetaSinDatos : `${valor.toFixed(2)} %`}
                </span>
              </div>
              <div
                className="bg-muted h-2 w-full overflow-hidden rounded-full"
                role="img"
                aria-label={`${item.periodoNombre}: ${valor === null ? etiquetaSinDatos : `${valor.toFixed(2)} %`}`}
              >
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${valor === null ? 0 : Math.min(Math.max(valor, 0), 100)}%` }}
                />
              </div>
              {item.enCurso && item.mensajeEnCurso && (
                <p className="text-muted-foreground text-xs">{item.mensajeEnCurso}</p>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
